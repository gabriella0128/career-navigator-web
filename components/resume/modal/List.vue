<script setup lang="ts">
import { useResumeStore, storeToRefs, useHandleApi, useModal } from "#imports";

const resumeStore = useResumeStore();
const { updateDetailResumeReq } = resumeStore;

const { selectedResumeList, selectedResume } = storeToRefs(resumeStore);
const { showModal, hideModal } = useModal();

const changeResume = () => resumeStore.changeResume();
const retrieveResume = () => resumeStore.retrieveResumeDetail();

const handleChangeResume = async (resumeIdx: number) => {
  // 선택한 이력서 idx 세팅
  updateDetailResumeReq(resumeIdx);

  // 대표 이력서 변경 API
  const result = await useHandleApi(changeResume());
  if (!result) return;

  // 성공 모달
  openMsgModal("변경 완료", "변경되었습니다.", () => {
    hideModal("change-confirm-modal");
  });

  // 상세 재조회
  await useHandleApi(retrieveResume());
};

const showChangeConfirm = (resumeIdx: number) => {
  // 이미 대표 이력서면 무시 (널 가드)
  console.log(resumeIdx);
  if (selectedResume.value?.resumeIdx === resumeIdx) return;

  showModal({
    id: "change-confirm-modal",
    component: "MessageModal",
    category: "common",
    title: "대표 이력서 변경",
    message: "해당 이력서를 대표이력서로 설정하시겠습니까?",
    buttons: [
      {
        id: "completed",
        label: "변경",
        class: "btn-blue",
        onClick: () => handleChangeResume(resumeIdx),
      },
      {
        id: "cancel",
        label: "닫기",
        class: "btn-skyBlue",
        onClick: () => hideModal("change-confirm-modal"),
      },
    ],
    onClose: () => hideModal("change-confirm-modal"),
  });
};

const openMsgModal = (
  title: string,
  message: string,
  closeAction?: () => void | null
) => {
  showModal({
    id: "msg-modal",
    category: "common",
    component: "MessageModal",
    title,
    message,
    buttons: [
      {
        id: "cancel",
        label: "닫기",
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

const formatDate = (v?: string | Date | null) => {
  if (!v) return "";
  if (v instanceof Date) return toYMD(v);

  const s = String(v);

  // "YYYY-MM-DD..." 형태면 앞 10자리만
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];

  // yyyyMMdd
  if (/^\d{8}$/.test(s)) {
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  }

  // 파싱 가능한 날짜 문자열
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return toYMD(d);

  return s; // 마지막 수단: 원문 노출
};

const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
</script>

<template>
  <div class="resume-table">
    <table>
      <thead>
        <tr>
          <th>이력서 제목</th>
          <th>등록일</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in selectedResumeList"
          :key="row.resumeIdx"
          @click="showChangeConfirm(row.resumeIdx)"
          style="cursor: pointer"
        >
          <td class="title-cell">{{ row.title }}</td>
          <td>{{ formatDate(row.createDt) }}</td>
        </tr>

        <tr v-if="!selectedResumeList || !selectedResumeList.length">
          <td class="empty" colspan="2">데이터가 없습니다</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
