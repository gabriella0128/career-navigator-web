<!-- Dashboard.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs, useHandleApi, useDashboardStore } from "#imports";
import type { CalendarDay } from "~/types/dashboard";
const dashboardStore = useDashboardStore();

const { dashboardData } = storeToRefs(dashboardStore);
const retrieveDashboard = () => dashboardStore.retrieveDashboard();

/** ===== Helper ===== */
const today = new Date();
const ymd = (d: Date) => d.toISOString().slice(0, 10);

/** 히스토그램 너비(%) */
const histWidth = (count: number) => {
  const max = Math.max(
    ...(dashboardData.value?.scoreHistogram?.map((b) => b.count) ?? []),
    1
  );
  return (count / max) * 100;
};

/** 달력 빌드 */
const monthStart = computed(() => {
  // calendar.month: 'YYYY-MM' 가정
  const [y, m] = (dashboardData.value?.calendar.month || ymd(today).slice(0, 7))
    .split("-")
    .map(Number);
  return new Date(y, m - 1, 1);
});
const leadingBlanks = computed(() => monthStart.value.getDay()); // 0(일)~6(토)
const monthDays = computed(() => {
  const start = monthStart.value;
  const year = start.getFullYear();
  const month = start.getMonth(); // 0~11
  const end = new Date(year, month + 1, 0).getDate(); // 말일
  const map = new Map(
    dashboardData.value?.calendar.days.map((d) => [d.date, d.count])
  );
  const arr: CalendarDay[] = [];
  for (let day = 1; day <= end; day++) {
    const key = new Date(year, month, day).toISOString().slice(0, 10);
    arr.push({ date: key, count: map.get(key) ?? 0 });
  }
  return arr;
});

/** 히트맵 색상 */
const heat = (cnt: number) =>
  cnt === 0
    ? "#f5f5f7"
    : `rgba(25,118,210,${Math.min(0.18 + cnt * 0.12, 0.9)})`;

onMounted(async () => {
  await useHandleApi(retrieveDashboard());
});
</script>

<template>
  <div class="dashboard">
    <div class="dashboard__page">
      <!-- ========== 상단 KPI ========== -->
      <div class="section">
        <v-row dense>
          <v-col
            cols="12"
            sm="4"
            md="3"
            v-for="k in dashboardData?.kpis"
            :key="k.label"
          >
            <v-card class="card">
              <div class="kpi-head">
                <div class="kpi-label">{{ k.label }}</div>
              </div>
              <div class="kpi-value">{{ k.value }}</div>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- ========== 분포 & 카테고리 ========== -->
      <div class="section">
        <v-row dense>
          <v-col cols="12" md="6">
            <v-card class="card">
              <div class="card-title">점수 분포(1~5)</div>
              <div class="histogram">
                <div
                  v-for="b in dashboardData?.scoreHistogram"
                  :key="b.score"
                  class="bar-row"
                >
                  <div class="bar-label">점수 {{ b.score }}</div>
                  <div class="bar-track">
                    <div
                      class="bar-fill"
                      :style="{ width: histWidth(b.count) + '%' }"
                    />
                  </div>
                  <div class="bar-count">{{ b.count }}</div>
                </div>
              </div>
              <div class="muted mt-8">
                총
                {{
                  dashboardData?.scoreHistogram.reduce(
                    (s, b) => s + b.count,
                    0
                  )
                }}건
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="card">
              <div class="card-title">카테고리별 평균/건수</div>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>카테고리</th>
                    <th>평균 점수</th>
                    <th>답변 수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="c in dashboardData?.categoryStats"
                    :key="c.category"
                  >
                    <td class="text-capitalize">{{ c.category }}</td>
                    <td>{{ c.avg.toFixed(2) }}</td>
                    <td>{{ c.answers }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- ========== 달력 & 하이라이트 ========== -->
      <div class="section">
        <v-row dense>
          <v-col cols="12" md="7">
            <v-card class="card">
              <div class="card-head">
                <div class="card-title">이번 달 캘린더</div>
                <div class="muted">{{ dashboardData?.calendar.month }}</div>
              </div>

              <div class="calendar-grid">
                <div
                  class="weekday"
                  v-for="w in ['일', '월', '화', '수', '목', '금', '토']"
                  :key="w"
                >
                  {{ w }}
                </div>

                <!-- 앞쪽 빈칸 -->
                <div
                  v-for="n in leadingBlanks"
                  :key="'blank-' + n"
                  class="day-cell blank"
                />

                <!-- 실제 일자 -->
                <div
                  v-for="d in monthDays"
                  :key="d.date"
                  class="day-cell"
                  :style="{ backgroundColor: heat(d.count) }"
                  :title="`${d.date} • ${d.count}건`"
                >
                  <span class="day-num">{{ d.date.slice(-2) }}</span>
                  <small class="ml-1">{{ d.count }}</small>
                </div>
              </div>

              <div class="muted mt-8">
                색 진할수록 해당 일의 답변 수가 많습니다.
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
            <v-card class="card">
              <div class="card-title">하이라이트</div>

              <div class="mb-12">
                <strong>최근 피드백</strong>
                <div class="snippet">
                  {{ dashboardData?.highlights.recentFeedback }}
                </div>
              </div>

              <div class="mb-12">
                <strong>강점</strong><br />
                <v-chip
                  v-for="s in dashboardData?.highlights.topStrength"
                  :key="s"
                  size="small"
                  class="chip"
                  >{{ s }}</v-chip
                >
              </div>

              <div>
                <strong>개선</strong><br />
                <v-chip
                  color="warning"
                  variant="tonal"
                  v-for="i in dashboardData?.highlights.topImprovements"
                  :key="i"
                  size="small"
                  class="chip"
                  >{{ i }}</v-chip
                >
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
