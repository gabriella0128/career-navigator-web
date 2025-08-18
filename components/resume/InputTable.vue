<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { toIsoDate } from "#imports";

const props = defineProps<{
  title: string;
  columns: Column[];
  modelValue: Record<string, string | number | null>[];
}>();
const emit = defineEmits<{
  (
    e: "update:modelValue",
    value: Record<string, string | number | null>[]
  ): void;
}>();

type Cell = string | number | null;
type Row = Record<string, Cell>;

interface Column {
  label: string;
  field: string;
  type?: "text" | "number" | "date";
  placeholder?: string;
}

const internalRows = ref<Row[]>([]);

const syncFromProps = () => {
  const fields = props.columns.map((c) => c.field);
  internalRows.value = (props.modelValue ?? []).map((src) => {
    const row: Row = { ...src };
    fields.forEach((f) => {
      if (!(f in row)) row[f] = null;
    });
    return row;
  });
};
watch(() => [props.modelValue, props.columns], syncFromProps, {
  immediate: true,
  deep: true,
});

const getCell = (r: number, f: string): Cell =>
  internalRows.value[r]?.[f] ?? null;

const setCell = (r: number, f: string, v: Cell) => {
  if (!internalRows.value[r]) internalRows.value[r] = {} as Row;
  if (!(f in internalRows.value[r])) internalRows.value[r][f] = null;
  internalRows.value[r][f] = v;
  emit("update:modelValue", internalRows.value);
};

const formatDate = (cell: string | number | null): string => {
  if (cell == null) return "";
  if (typeof cell !== "string") return "";
  const m = cell.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : "";
};

const onDateUpdate = (rowIndex: number, field: string, v: unknown) => {
  const iso = toIsoDate(v);
  setCell(rowIndex, field, iso);
  setMenu(rowIndex, field, false);
};

// 메뉴 오픈 상태 (행×필드)
const menuOpen = ref<Record<number, Record<string, boolean>>>({});
const getMenu = (r: number, f: string) => menuOpen.value[r]?.[f] ?? false;
const setMenu = (r: number, f: string, val: boolean) => {
  if (!menuOpen.value[r]) menuOpen.value[r] = {};
  menuOpen.value[r][f] = val;
};

// 날짜 지우기
const clearDate = (r: number, f: string) => setCell(r, f, null);
// 부모가 v-model 을 바꾸면 내부에도 반영
watch(
  () => props.modelValue,
  (newVal) => {
    const a = JSON.stringify(newVal);
    const b = JSON.stringify(internalRows.value);
    if (a !== b) {
      internalRows.value = newVal.map((r) => ({ ...r }));
    }
  },
  { deep: true }
);

// 내부가 변경되면 부모에 이벤트로 알림
watch(
  internalRows,
  (newVal) => {
    const a = JSON.stringify(newVal);
    const b = JSON.stringify(props.modelValue);
    if (a !== b) {
      emit("update:modelValue", newVal);
    }
  },
  { deep: true }
);

// 빈 행 생성 함수
const addRow = () => {
  const empty: Record<string, string> = {};
  props.columns.forEach((c) => {
    empty[c.field] = "";
  });
  internalRows.value.push(empty);
};

const removeRow = (index: number) => {
  internalRows.value.splice(index, 1);
};
</script>

<template>
  <div class="resume-input">
    <div class="resume-title">{{ title }}</div>

    <!-- 여기에 cols 개수만큼 1fr 반복 -->
    <div class="input-grid" :style="{ '--col-count': columns.length }">
      <!-- 헤더 -->
      <div v-for="col in columns" :key="col.field" class="header-cell">
        {{ col.label }}
      </div>
      <div class="header-cell action-header"></div>
      <!-- 데이터 행 -->
      <template v-for="(row, rowIndex) in internalRows" :key="rowIndex">
        <template v-for="col in columns" :key="`cell-${rowIndex}-${col.field}`">
          <!-- date -->
          <v-menu
            v-if="col.type === 'date'"
            :model-value="getMenu(rowIndex, col.field)"
            @update:model-value="(v) => setMenu(rowIndex, col.field, v)"
            :close-on-content-click="false"
            location="bottom"
            :offset="8"
          >
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                :model-value="formatDate(getCell(rowIndex, col.field))"
                :placeholder="col.placeholder || ''"
                hide-details
                density="compact"
                class="grid-cell"
                readonly
                clearable
                @click:clear="() => clearDate(rowIndex, col.field)"
              >
                <template #append-inner>
                  <v-icon class="mdi mdi-calendar-range-outline" />
                </template>
              </v-text-field>
            </template>

            <v-date-picker
              :model-value="getCell(rowIndex, col.field)"
              @update:model-value="(v) => onDateUpdate(rowIndex, col.field, v)"
              @update:modelValue="(v) => onDateUpdate(rowIndex, col.field, v)"
            />
          </v-menu>

          <!-- text/number -->
          <v-text-field
            v-else
            :model-value="getCell(rowIndex, col.field)"
            @update:model-value="
              (v) => setCell(rowIndex, col.field, v as string)
            "
            :type="col.type || 'text'"
            :placeholder="col.placeholder || ''"
            hide-details
            density="compact"
            class="grid-cell"
          />
        </template>
        <div class="action-cell">
          <v-btn icon small class="delete-btn" @click="removeRow(rowIndex)">
            <v-icon class="mdi mdi-close"></v-icon>
          </v-btn>
        </div>
      </template>
    </div>

    <div class="add-btn-wrap">
      <v-btn icon @click="addRow">
        <v-icon class="mdi mdi-plus-circle" />
      </v-btn>
    </div>
  </div>
</template>
