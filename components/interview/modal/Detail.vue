<script setup lang="ts">
import { storeToRefs, useInterviewStore, useModal, computed } from "#imports";
import type {} from "~/types/interview";
const props = defineProps<{
  id: string; // 모달 고유 아이디
  onClose?: () => void;
}>();

const interviewStore = useInterviewStore();

const { dailyQuestionDetail } = storeToRefs(interviewStore);
const { hideModal } = useModal();

const parsedScores = computed<Record<string, number | string>>(() => {
  const raw = dailyQuestionDetail.value?.scores ?? "";
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw);
    return typeof obj === "object" && obj ? obj : {};
  } catch {
    return { scores: raw };
  }
});
const parsedScoresKeys = computed(() => Object.keys(parsedScores.value));
const close = () => {
  hideModal(props.id);
};
</script>

<template>
  <div class="detail-wrap" v-if="dailyQuestionDetail">
    <div class="grid">
      <div class="field">
        <div class="label">질문</div>
        <div class="value pre">{{ dailyQuestionDetail.question ?? "-" }}</div>
      </div>

      <div class="field">
        <div class="label">답변</div>
        <div class="value pre">{{ dailyQuestionDetail.answer ?? "-" }}</div>
      </div>

      <div class="row">
        <div class="field small">
          <div class="label">총점</div>
          <div class="value">
            <span
              v-if="dailyQuestionDetail.scoreOverall !== null"
              class="score-chip"
            >
              {{ dailyQuestionDetail.scoreOverall }}
            </span>
            <span v-else>-</span>
          </div>
        </div>

        <div class="field">
          <div class="label">세부 점수</div>
          <div class="value">
            <template v-if="parsedScoresKeys.length">
              <ul class="score-list">
                <li v-for="k in parsedScoresKeys" :key="k">
                  <span class="k">{{ k }}</span>
                  <span class="v">{{ parsedScores[k] }}</span>
                </li>
              </ul>
            </template>
            <template v-else>-</template>
          </div>
        </div>
      </div>

      <div class="field">
        <div class="label">피드백</div>
        <div class="value pre">{{ dailyQuestionDetail.feedback ?? "-" }}</div>
      </div>

      <div class="row">
        <div class="field">
          <div class="label">강점</div>
          <div class="value pre">{{ dailyQuestionDetail.strength ?? "-" }}</div>
        </div>
        <div class="field">
          <div class="label">개선점</div>
          <div class="value pre">
            {{ dailyQuestionDetail.improvements ?? "-" }}
          </div>
        </div>
      </div>
    </div>

    <div class="actions">
      <v-btn variant="text" @click="close">닫기</v-btn>
    </div>
  </div>

  <div v-else class="loading">
    <v-progress-circular indeterminate />
  </div>
</template>
