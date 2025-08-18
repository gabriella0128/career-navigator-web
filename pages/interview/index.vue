<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  storeToRefs,
  useHandleApi,
  useInterviewStore,
  useModal,
} from "#imports";
import type { QuestionRes } from "~/types/interview";
const interviewStore = useInterviewStore();

const { showModal, hideModal } = useModal();
const { updateDailyQuestionDetailReq } = interviewStore;
const { dailyQuestions, modalMode } = storeToRefs(interviewStore);
const retrieveDailyQuestion = () => interviewStore.retrieveDailyQuestion();
const generateDailyQuestion = () => interviewStore.generateDailyQuestion();
const retrieveDailyQuestionDetail = () =>
  interviewStore.retrieveDailyQuestionDetail();
const selectedRow = ref<number | null>(null);
const openMsgModal = (
  title: string,
  message: string,
  closeAction?: () => void | null
) => {
  showModal({
    id: "msg-modal",
    category: "common",
    component: "MessageModal",
    title: title,
    message: message,
    buttons: [
      {
        id: "completed",
        label: "확인",
        class: "btn-blue",
        onClick: closeAction
          ? () => {
              hideModal("msg-modal");
              closeAction();
            }
          : () => hideModal("msg-modal"),
      },
    ],
    onClose: closeAction
      ? () => {
          hideModal("msg-modal");
          closeAction();
        }
      : () => hideModal("msg-modal"),
  });
};

const openConfirmModal = (
  title: string,
  message: string,
  onClick: () => void,
  onClose: () => void
) => {
  showModal({
    id: "msg-confirm-modal",
    component: "MessageModal",
    title: title,
    message: message,
    category: "common",
    buttons: [
      {
        id: "confirm",
        label: "확인",
        class: "btn-rmr btn-blue",
        onClick: onClick,
      },
      {
        id: "cancel",
        label: "취소",
        class: "btn-rmr btn-line",
        onClick: onClose,
      },
    ],
  });
};
const closeConfirmModal = () => {
  hideModal("msg-confirm-modal");
};
const confirmGenerate = async () => {
  openConfirmModal(
    "면접 질문 생성 확인",
    "오늘의 면접 질문은 현재 대표 이력서를 기반으로 하루에 한 번만 생성 가능합니다. 생성하시겠습니까?",
    handleGenerateDailyQuestion,
    closeConfirmModal
  );
};
const handleGenerateDailyQuestion = async () => {
  closeConfirmModal();
  const result = await useHandleApi(generateDailyQuestion(), true);
  if (!result) {
    return;
  }

  openMsgModal("면접 질문 생성 완료", "면접 질문 생성 완료되었습니다.", () => {
    close();
  });
  await useHandleApi(retrieveDailyQuestion());
};

const difficultyClass = (v: number) => {
  if (v === 1) return "easy";
  if (v === 2) return "medium";
  if (v === 3) return "hard";
  return "neutral";
};

const onRowClick = async (q: QuestionRes) => {
  selectedRow.value = q.questionIdx;
  modalMode.value = q.answered ? "answered" : "waiting";
  updateDailyQuestionDetailReq(q.questionIdx);
  await useHandleApi(retrieveDailyQuestionDetail());
  showModal({
    id: "interview-modal",
    category: "interview",
    component: "InterviewModal",
    title: "interview-modal",
  });
};

onMounted(async () => {
  await useHandleApi(retrieveDailyQuestion());
});
</script>

<template>
  <div class="interview-wrapper">
    <section class="content-wrap">
      <div class="inner">
        <div class="inner-top">
          <v-btn
            class="btn-new"
            v-if="!dailyQuestions.length"
            @click="confirmGenerate"
          >
            오늘의 질문 생성
          </v-btn>
        </div>
        <div class="inner-content">
          <div v-if="dailyQuestions.length" class="table-wrap">
            <div class="tbl-scroll">
              <table class="interview-table">
                <thead>
                  <tr>
                    <th class="col-num">번호</th>
                    <th class="col-question">질문</th>
                    <th class="col-diff">난이도</th>
                    <th class="col-status">답변여부</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="q in dailyQuestions"
                    :key="q.questionIdx"
                    class="row-clickable"
                    :class="{ 'is-selected': selectedRow === q.questionIdx }"
                    tabindex="0"
                    @click="onRowClick(q)"
                    @keydown.enter.prevent="onRowClick(q)"
                    @keydown.space.prevent="onRowClick(q)"
                  >
                    <td class="col-num">
                      <span class="cell-ellipsis">{{ q.position }}</span>
                    </td>
                    <td class="col-question">
                      <span class="cell-ellipsis">{{ q.question }}</span>
                    </td>
                    <td class="col-diff">
                      <span
                        class="chip"
                        :class="`chip--${difficultyClass(q.difficulty)}`"
                        @click.stop
                      >
                        {{ q.difficulty }}
                      </span>
                    </td>
                    <td class="col-status">
                      <span
                        class="chip"
                        :class="`chip--${q.answered ? 'answered' : 'waiting'}`"
                        @click.stop
                      >
                        {{ q.answered ? "완료" : "대기" }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="no-question"></div>
        </div>
      </div>
    </section>
  </div>
</template>
