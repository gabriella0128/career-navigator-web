<script setup lang="ts">
import {
  storeToRefs,
  useHandleApi,
  useInterviewStore,
  useModal,
  computed,
  ref,
} from "#imports";
import type {} from "~/types/interview";
const props = defineProps<{
  id: string; // 모달 고유 아이디
  onClose?: () => void;
}>();

const interviewStore = useInterviewStore();
const { updateDailyQuestiontAnswerInsertReq, resetAnswerInsertReq } =
  interviewStore;
const { dailyQuestionDetail, answerInsertReq, modalMode, dailyQuestions } =
  storeToRefs(interviewStore);
const { hideModal } = useModal();
const generateDailyQuestionAnswer = () =>
  interviewStore.generateDailyQuestionAnswer();

const retrieveDailyQuestionDetail = () =>
  interviewStore.retrieveDailyQuestionDetail();

const loading = ref(false);
const submitting = ref(false);
const minLenRule = (v: string) =>
  !v || v.trim().length >= 10 || "10자 이상 작성해 주세요.";
const canSubmit = computed(
  () => answerInsertReq.value.answer!.trim().length >= 1 && !submitting.value
);

const handleGenerateAnswer = async () => {
  updateDailyQuestiontAnswerInsertReq(dailyQuestionDetail.value!.questionIdx);
  const generateResult = await useHandleApi(
    generateDailyQuestionAnswer(),
    true
  );
  if (!generateResult) return;
  resetAnswerInsertReq();

  const detailResult = await useHandleApi(retrieveDailyQuestionDetail());
  if (!detailResult) return;

  modalMode.value = "answered";

  const item = dailyQuestions.value.find(
    (q) => q.questionIdx === dailyQuestionDetail.value!.questionIdx
  );
  if (item) item.answered = true;
};
const close = () => {
  hideModal(props.id);
};
</script>
<template>
  <div class="register-wrap">
    <div class="section">
      <div class="label">질문 {{ dailyQuestionDetail!.position }}</div>
      <div class="question">
        {{ dailyQuestionDetail?.question || "질문을 불러오는 중..." }}
      </div>
    </div>

    <div class="section">
      <div class="label">
        답변
        <span class="hint">(최소 10자 이상 권장)</span>
      </div>
      <v-textarea
        v-model="answerInsertReq.answer"
        auto-grow
        rows="6"
        placeholder="여기에 답변을 작성해 주세요."
        :counter="2000"
        :rules="[minLenRule]"
        :disabled="loading || submitting"
        class="answer-textarea"
      />
    </div>

    <div class="actions">
      <v-btn
        class="btn-cancel"
        variant="text"
        :disabled="submitting"
        @click="close"
      >
        취소
      </v-btn>
      <v-btn
        class="btn-submit"
        color="primary"
        :loading="submitting"
        :disabled="!canSubmit"
        @click="handleGenerateAnswer"
      >
        제출
      </v-btn>
    </div>

    <div class="loading" v-if="loading">
      <v-progress-circular indeterminate />
    </div>
  </div>
</template>
