<script setup lang="ts">
import { defineProps } from "vue";

interface Column {
  text: string; // 헤더에 표시할 텍스트
  value: string; // row[value] 로 데이터를 참조
  type?: string;
}

const props = defineProps<{
  columns: Column[];
  items: Record<string, string | number | null>[];
}>();
</script>
<template>
  <div class="resume-table">
    <table>
      <thead>
        <tr>
          <th v-for="col in props.columns" :key="col.value">
            {{ col.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in props.items" :key="rowIndex">
          <td v-for="col in columns" :key="col.value">
            {{
              col.type === "date"
                ? String(row[col.value]).match(/^(\d{4}-\d{2}-\d{2})/)
                  ? String(row[col.value]).substring(0, 10)
                  : ""
                : row[col.value]
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
