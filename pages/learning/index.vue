<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import {
  storeToRefs,
  useHandleApi,
  useLearningStore,
  useModal,
} from "#imports";
const learningStore = useLearningStore();
import type { LearningTaskRes } from "../../types/learning";
const { showModal, hideModal } = useModal();

const { learningPlan } = storeToRefs(learningStore);
const retrieveLearningPlan = () => learningStore.retrieveLearningPlan();
const generateLearningPlan = () => learningStore.generateLearningPlan();
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
    "학습 계획 생성 확인",
    "학습 계획은 현재 대표 이력서를 기반으로 매달 한 번만 생성 가능합니다. 생성하시겠습니까?",
    handleGenerateLearningPlan,
    closeConfirmModal
  );
};
const handleGenerateLearningPlan = async () => {
  closeConfirmModal();
  const result = await useHandleApi(generateLearningPlan(), true);
  if (!result) {
    return;
  }

  openMsgModal("학습 계획 생성 완료", "학습 계획 생성 완료되었습니다.", () => {
    close();
  });
  await useHandleApi(retrieveLearningPlan());
};
const openSet = ref(new Set());

const sortedGoals = computed(() =>
  (learningPlan.value?.learningGoals ?? [])
    .slice()
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
);

const sortedTasks = (tasks: LearningTaskRes[]) =>
  tasks.slice().sort((a, b) => (a.weekNo ?? 0) - (b.weekNo ?? 0));

const isOpen = (id: number) => openSet.value.has(id);

const onToggle = (id: number, ev: Event) => {
  const el = ev.currentTarget as HTMLDetailsElement | null;
  if (el?.open) openSet.value.add(id);
  else openSet.value.delete(id);
};

const expandAll = () => {
  const s = new Set();
  for (const g of sortedGoals.value) s.add(g.goalIdx);
  openSet.value = s;
};

const collapseAll = () => {
  openSet.value = new Set();
};

const priorityClass = (p: number) =>
  p === 1
    ? "prio-urgent"
    : p === 2
      ? "prio-high"
      : p === 3
        ? "prio-med"
        : "prio-low";

const priorityLabel = (p: number) =>
  p === 1 ? "최우선" : p === 2 ? "높음" : p === 3 ? "보통" : "낮음";

onMounted(async () => {
  await useHandleApi(retrieveLearningPlan());
});
</script>

<template>
  <div class="lp-card">
    <div class="lp-header">
      <div class="lp-title-wrap">
        <span v-if="learningPlan" class="lp-chip"
          >{{ learningPlan.planMonth }}월 학습계획</span
        >
      </div>
      <div class="lp-header-right">
        <span class="lp-counter"
          >Goals: {{ learningPlan?.learningGoals?.length ?? 0 }}</span
        >
        <div class="lp-actions">
          <button class="lp-btn" @click="expandAll">전체 펼치기</button>
          <button class="lp-btn" @click="collapseAll">전체 접기</button>
        </div>
      </div>
    </div>

    <div class="lp-divider"></div>

    <div
      v-if="learningPlan && learningPlan.learningGoals?.length"
      class="lp-body"
    >
      <ul class="lp-goal-list">
        <li
          v-for="goal in sortedGoals"
          :key="goal.goalIdx"
          class="lp-goal-item"
        >
          <details
            class="lp-goal-details"
            :open="isOpen(goal.goalIdx)"
            @toggle="onToggle(goal.goalIdx, $event)"
          >
            <summary class="lp-goal-summary">
              <span
                class="lp-caret"
                :class="{ open: isOpen(goal.goalIdx) }"
              ></span>
              <span class="lp-priority" :class="priorityClass(goal.priority)">
                {{ priorityLabel(goal.priority) }}
              </span>
              <span class="lp-goal-name">{{ goal.title }}</span>
              <span class="lp-summary-right">
                <span class="lp-subtitle"
                  >{{ goal.metric }} 목표: {{ goal.targetValue }}</span
                >
                <span class="lp-chip tonal"
                  >{{ goal.learningTasks?.length ?? 0 }} tasks</span
                >
              </span>
            </summary>

            <div v-if="!goal.learningTasks?.length" class="lp-empty">
              작업이 없습니다.
            </div>

            <ul class="lp-task-list" v-else>
              <li
                v-for="task in sortedTasks(goal.learningTasks)"
                :key="task.taskIdx"
                class="lp-task-item"
              >
                <div class="lp-task-line">
                  <span class="lp-week">W{{ task.weekNo }}</span>
                  <span class="lp-task-title">{{ task.taskTitle }}</span>
                </div>
                <div class="lp-task-sub">
                  <a
                    v-if="task.resourceUrl"
                    class="lp-link"
                    :href="task.resourceUrl"
                    target="_blank"
                    rel="noopener"
                    >자료 링크</a
                  >
                </div>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>

    <div v-else class="lp-empty-global">
      <p class="lp-empty-text">표시할 데이터가 없습니다.</p>
      <button class="lp-btn lp-btn-primary" @click="confirmGenerate">
        월간학습계획 생성하기
      </button>
    </div>
  </div>
</template>
