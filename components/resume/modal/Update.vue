<script setup lang="ts">
import { storeToRefs, useHandleApi, useResumeStore, useModal } from "#imports";
import type {
  CertificateReq,
  EducationReq,
  ExperienceReq,
  LanguageReq,
  SkillReq,
  ValidationError,
} from "~/types/resume";
const props = defineProps<{
  id: string; // 모달 고유 아이디
  onClose?: () => void;
}>();
const resumeStore = useResumeStore();
const { isBlank, validateSection } = resumeStore;
const {
  selectedUpdateItem,
  updateResumeTitleReq,
  updateResumeSummaryReq,
  updateResumeEducationReq,
  updateResumeExperienceReq,
  updateResumeSkillReq,
  updateResumeCertificateReq,
  updateResumeLanguageReq,
} = storeToRefs(resumeStore);
const { showModal, hideModal } = useModal();
const retrieveResumeDetail = () => resumeStore.retrieveResumeDetail();

const updateResume = () => resumeStore.updateResume();
const close = () => {
  hideModal(props.id);
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

const validateUpdateResumeReq = (): {
  valid: boolean;
  errors: ValidationError[];
} => {
  const errors: ValidationError[] = [];

  switch (selectedUpdateItem.value) {
    case "title": {
      if (isBlank(updateResumeTitleReq.value)) {
        errors.push({ path: "title", message: "제목은 필수입니다." });
      }
      break;
    }

    case "education": {
      errors.push(
        ...validateSection<EducationReq>(
          (updateResumeEducationReq.value as EducationReq[] | null) ?? null,
          "educations",
          ["schoolName"],
          { ignoreKeys: ["educationIdx"], idKeys: ["educationIdx"] }
        )
      );
      break;
    }

    case "experience": {
      errors.push(
        ...validateSection<ExperienceReq>(
          (updateResumeExperienceReq.value as ExperienceReq[] | null) ?? null,
          "experiences",
          ["companyName"],
          { ignoreKeys: ["experienceIdx"], idKeys: ["experienceIdx"] }
        )
      );
      break;
    }

    case "skill": {
      errors.push(
        ...validateSection<SkillReq>(
          (updateResumeSkillReq.value as SkillReq[] | null) ?? null,
          "skills",
          ["skillName"],
          { ignoreKeys: ["skillIdx"], idKeys: ["skillIdx"] }
        )
      );
      break;
    }

    case "certificate": {
      errors.push(
        ...validateSection<CertificateReq>(
          (updateResumeCertificateReq.value as CertificateReq[] | null) ?? null,
          "certificates",
          ["certificateName"],
          { ignoreKeys: ["certificateIdx"], idKeys: ["certificateIdx"] }
        )
      );
      break;
    }

    case "language": {
      errors.push(
        ...validateSection<LanguageReq>(
          (updateResumeLanguageReq.value as LanguageReq[] | null) ?? null,
          "languages",
          ["languageName"],
          { ignoreKeys: ["languageIdx"], idKeys: ["languageIdx"] }
        )
      );
      break;
    }

    default: {
      break;
    }
  }

  return { valid: errors.length === 0, errors };
};

const handleResumeUpdate = async () => {
  const validationResult = validateUpdateResumeReq();

  if (!validationResult.valid) {
    openMsgModal(
      "필수값 누락",
      "필수값을 확인해주세요. " + validationResult.errors[0].message,
      () => {}
    );
    return;
  }
  const result = await useHandleApi(updateResume());
  if (!result) {
    return;
  }

  openMsgModal("수정 완료", "수정되었습니다.", () => {
    close();
  });
  await useHandleApi(retrieveResumeDetail());
};
</script>
<template>
  <div class="resume-form">
    <v-text-field
      v-if="selectedUpdateItem === 'title'"
      v-model="updateResumeTitleReq"
      label="이력서 제목"
      outlined
      dense
      class="mr-4"
    />
    <v-textarea
      v-if="selectedUpdateItem === 'summary'"
      v-model="updateResumeSummaryReq"
      label="요약"
      outlined
      dense
      rows="2"
      class="flex-grow-1"
    />
    <ResumeInputTable
      v-if="selectedUpdateItem === 'education'"
      title="학력"
      :columns="[
        { label: '학교명', field: 'schoolName' },
        { label: '학위종류', field: 'degree' },
        { label: '전공', field: 'major' },
        { label: '입학일', field: 'startDate', type: 'date' },
        { label: '졸업일', field: 'endDate', type: 'date' },
        { label: '추가 정보', field: 'description' },
      ]"
      v-model="updateResumeEducationReq"
    />

    <ResumeInputTable
      v-if="selectedUpdateItem === 'experience'"
      title="경력"
      :columns="[
        { label: '회사명', field: 'companyName' },
        { label: '직위', field: 'position' },
        { label: '입사일', field: 'startDate', type: 'date' },
        { label: '퇴사일', field: 'endDate', type: 'date' },
        { label: '상세', field: 'description' },
      ]"
      v-model="updateResumeExperienceReq"
    />
    <ResumeInputTable
      v-if="selectedUpdateItem === 'skill'"
      title="기술"
      :columns="[
        { label: '기술명', field: 'skillName' },
        { label: '숙련도', field: 'proficiency' },
      ]"
      v-model="updateResumeSkillReq"
    />

    <ResumeInputTable
      v-if="selectedUpdateItem === 'certificate'"
      title="자격증"
      :columns="[
        { label: '자격증명', field: 'certificateName' },
        { label: '발급처', field: 'issuedBy' },
        { label: '발급일', field: 'issueDate', type: 'date' },
      ]"
      v-model="updateResumeCertificateReq"
    />
    <ResumeInputTable
      v-if="selectedUpdateItem === 'language'"
      title="어학"
      :columns="[
        { label: '언어', field: 'languageName' },
        { label: '수준', field: 'level' },
        { label: '시험명', field: 'testName' },
        { label: '점수', field: 'testScore' },
      ]"
      v-model="updateResumeLanguageReq"
    />
  </div>
  <div class="form-actions">
    <v-btn color="primary" @click="handleResumeUpdate"> 수정 </v-btn>
    <v-btn color="secondary" @click="close"> 취소 </v-btn>
  </div>
</template>
