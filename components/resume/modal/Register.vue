<script setup lang="ts">
import { storeToRefs, useHandleApi, useResumeStore, useModal } from "#imports";
import type {
  CertificateReq,
  EducationReq,
  ExperienceReq,
  InsertResumeReq,
  LanguageReq,
  SkillReq,
  ValidationError,
} from "~/types/resume";
const props = defineProps<{
  id: string; // 모달 고유 아이디
  onClose?: () => void;
}>();

const resumeStore = useResumeStore();
const { resetInsertResumeReq, validateSection, isBlank } = resumeStore;
const { insertResumeReq } = storeToRefs(resumeStore);
const { showModal, hideModal } = useModal();

const insertResume = () => resumeStore.insertResume();
const retrieveResumeDetail = () => resumeStore.retrieveResumeDetail();
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
const handleResumeRegister = async () => {
  const validationResult = validateInsertResumeReq(insertResumeReq.value);

  if (!validationResult.valid) {
    openMsgModal(
      "필수값 누락",
      "필수값을 확인해주세요. " + validationResult.errors[0].message,
      () => {}
    );
    return;
  }
  const result = await useHandleApi(insertResume());
  if (!result) {
    return;
  }

  openMsgModal("이력서 등록 완료", "등록되었습니다.", () => {
    resetInsertResumeReq();
    close();
  });
  await useHandleApi(retrieveResumeDetail());
};
const close = () => {
  hideModal(props.id);
};

// validation start
const validateInsertResumeReq = (req: InsertResumeReq) => {
  const errors: ValidationError[] = [];

  // title 필수
  if (isBlank(req.title)) {
    errors.push({ path: "title", message: "제목은 필수입니다." });
  }
  errors.push(
    ...validateSection<EducationReq>(
      (req.educations as EducationReq[] | null) ?? null,
      "educations",
      ["schoolName"],
      {
        ignoreKeys: ["educationIdx"],
        idKeys: ["educationIdx"],
      }
    )
  );

  errors.push(
    ...validateSection<ExperienceReq>(
      (req.experiences as ExperienceReq[] | null) ?? null,
      "experiences",
      ["companyName"],
      {
        ignoreKeys: ["experienceIdx"],
        idKeys: ["experienceIdx"],
      }
    )
  );

  errors.push(
    ...validateSection<SkillReq>(
      (req.skills as SkillReq[] | null) ?? null,
      "skills",
      ["skillName"],
      {
        ignoreKeys: ["skillIdx"],
        idKeys: ["skillIdx"],
      }
    )
  );

  errors.push(
    ...validateSection<CertificateReq>(
      (req.certificates as CertificateReq[] | null) ?? null,
      "certificates",
      ["certificateName"],
      {
        ignoreKeys: ["certificateIdx"],
        idKeys: ["certificateIdx"],
      }
    )
  );

  errors.push(
    ...validateSection<LanguageReq>(
      (req.languages as LanguageReq[] | null) ?? null,
      "languages",
      ["languageName"],
      {
        ignoreKeys: ["languageIdx"],
        idKeys: ["languageIdx"],
      }
    )
  );

  return { valid: errors.length === 0, errors };
};
</script>

<template>
  <div class="resume-form">
    <!-- 상단: 제목 + 요약 -->
    <div class="resume-form-header">
      <v-text-field
        v-model="insertResumeReq.title"
        label="이력서 제목"
        outlined
        dense
        class="mr-4"
      />
      <v-textarea
        v-model="insertResumeReq.summary"
        label="요약"
        outlined
        dense
        rows="2"
        class="flex-grow-1"
      />
    </div>
    <ResumeInputTable
      title="학력"
      :columns="[
        { label: '학교명', field: 'schoolName' },
        { label: '학위종류', field: 'degree' },
        { label: '전공', field: 'major' },
        { label: '입학일', field: 'startDate', type: 'date' },
        { label: '졸업일', field: 'endDate', type: 'date' },
        { label: '추가 정보', field: 'description' },
      ]"
      v-model="insertResumeReq.educations"
    />

    <ResumeInputTable
      title="경력"
      :columns="[
        { label: '회사명', field: 'companyName' },
        { label: '직위', field: 'position' },
        { label: '입사일', field: 'startDate', type: 'date' },
        { label: '퇴사일', field: 'endDate', type: 'date' },
        { label: '상세', field: 'description' },
      ]"
      v-model="insertResumeReq.experiences"
    />
    <ResumeInputTable
      title="기술"
      :columns="[
        { label: '기술명', field: 'skillName' },
        { label: '숙련도', field: 'proficiency' },
      ]"
      v-model="insertResumeReq.skills"
    />

    <ResumeInputTable
      title="자격증"
      :columns="[
        { label: '자격증명', field: 'certificateName' },
        { label: '발급처', field: 'issuedBy' },
        { label: '발급일', field: 'issueDate', type: 'date' },
      ]"
      v-model="insertResumeReq.certificates"
    />
    <ResumeInputTable
      title="어학"
      :columns="[
        { label: '언어', field: 'languageName' },
        { label: '수준', field: 'level' },
        { label: '시험명', field: 'testName' },
        { label: '점수', field: 'testScore' },
      ]"
      v-model="insertResumeReq.languages"
    />
    <div class="form-actions">
      <v-btn color="primary" @click="handleResumeRegister"> 등록 </v-btn>
      <v-btn color="secondary" @click="close"> 취소 </v-btn>
    </div>
  </div>
</template>
