<script setup lang="ts">
import { computed, defineEmits, defineProps } from "vue";

const props = defineProps<{
  inputName: string; // 입력란 이름
  modelValue: string;
  label: string; // 입력란 라벨
  placeholder?: string; // 입력란 힌트
  regex?: RegExp; // 유효성 검사에 사용할 정규식
  type?: string; // 입력란 타입
  validationMessages?: string;
}>();

const emits = defineEmits(["update:modelValue"]);

const computedRules = computed(() => {
  const rules = [];
  if (props.regex) {
    rules.push(
      (v: string) =>
        props.regex!.test(v) || `${props.label}이(가) 유효하지 않습니다.`
    );
  }
  return rules;
});

const inputValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue: string) {
    emits("update:modelValue", newValue);
  },
});
</script>

<template>
  <v-text-field
    class="validation-input"
    :type="props.type"
    :label="props.label"
    :placeholder="props.placeholder"
    v-model="inputValue"
    :rules="computedRules"
    :error-messages="props.validationMessages"
    outlined
    dense
  />
</template>
