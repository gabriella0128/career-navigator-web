<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs, useHandleApi, useResumeStore, useModal } from "#imports";
const resumeStore = useResumeStore();

const { showModal } = useModal();
const {
  resetInsertResumeReq,
  resetUpdateResumeSummaryReq,
  resetUpdateResumeTitleReq,
  resetUpdateResumeEducationReq,
  resetUpdateResumeExperienceReq,
  resetUpdateResumeSkillReq,
  resetUpdateResumeCertificateReq,
  resetUpdateResumeLanguageReq,
} = resumeStore;
const { selectedResume, modalMode, selectedUpdateItem } =
  storeToRefs(resumeStore);
const retrieveResumeDetail = () => resumeStore.retrieveResumeDetail();

const educationColumns = [
  { text: "학교명", value: "schoolName" },
  { text: "학위종류", value: "degree" },
  { text: "전공", value: "major" },
  { text: "입학일", value: "startDate", type: "date" },
  { text: "졸업일", value: "endDate", type: "date" },
  { text: "추가 정보", value: "description" },
];

const experienceColumns = [
  { text: "회사명", value: "companyName" },
  { text: "직위", value: "position" },
  { text: "입사일", value: "startDate", type: "date" },
  { text: "퇴사일", value: "endDate", type: "date" },
  { text: "추가 정보", value: "description" },
];

const skillColumns = [
  { text: "기술이름", value: "skillName" },
  { text: "숙련도", value: "proficiency" },
];

const certificateColumns = [
  { text: "자격증이름", value: "certificateName" },
  { text: "발급처", value: "issuedBy" },
  { text: "발급일", value: "issueDate", type: "date" },
];

const languageColumns = [
  { text: "언어", value: "languageName" },
  { text: "수준", value: "level" },
  { text: "시험명", value: "testName" },
  { text: "점수", value: "testScore" },
];
const onEditTitle = () => {
  modalMode.value = "update";
  selectedUpdateItem.value = "title";
  resetUpdateResumeTitleReq();
  showModal({
    id: "resume-modal",
    category: "resume",
    component: "ResumeModal",
    title: "resume-modal",
  });
};
const onEditSummary = () => {
  modalMode.value = "update";
  selectedUpdateItem.value = "summary";
  resetUpdateResumeSummaryReq();
  showModal({
    id: "resume-modal",
    category: "resume",
    component: "ResumeModal",
    title: "resume-modal",
  });
};

const onEditEducation = () => {
  modalMode.value = "update";
  selectedUpdateItem.value = "education";
  resetUpdateResumeEducationReq();
  showModal({
    id: "resume-modal",
    category: "resume",
    component: "ResumeModal",
    title: "resume-modal",
  });
};
const onEditExperience = () => {
  modalMode.value = "update";
  selectedUpdateItem.value = "experience";
  resetUpdateResumeExperienceReq();
  showModal({
    id: "resume-modal",
    category: "resume",
    component: "ResumeModal",
    title: "resume-modal",
  });
};

const onEditSkill = () => {
  modalMode.value = "update";
  selectedUpdateItem.value = "skill";
  resetUpdateResumeSkillReq();
  showModal({
    id: "resume-modal",
    category: "resume",
    component: "ResumeModal",
    title: "resume-modal",
  });
};

const onEditCertificate = () => {
  modalMode.value = "update";
  selectedUpdateItem.value = "certificate";
  resetUpdateResumeCertificateReq();
  showModal({
    id: "resume-modal",
    category: "resume",
    component: "ResumeModal",
    title: "resume-modal",
  });
};

const onEditLanguage = () => {
  modalMode.value = "update";
  selectedUpdateItem.value = "language";
  resetUpdateResumeLanguageReq();
  showModal({
    id: "resume-modal",
    category: "resume",
    component: "ResumeModal",
    title: "resume-modal",
  });
};

const changeRepresentResume = () => {};

const registerResume = () => {
  resetInsertResumeReq();
  modalMode.value = "register";
  showModal({
    id: "resume-modal",
    category: "resume",
    component: "ResumeModal",
    title: "resume-modal",
  });
};

onMounted(async () => {
  await useHandleApi(retrieveResumeDetail());
});
</script>

<template>
  <div class="resume-wrapper">
    <section class="content-wrap">
      <div class="inner">
        <div class="inner-top">
          <v-btn class="btn-new" @click="registerResume">
            신규이력서 등록
          </v-btn>
          <v-btn class="btn-change" @click="changeRepresentResume">
            대표이력서 변경
          </v-btn>
        </div>
        <!-- 학력 섹션 -->
        <div class="inner-content">
          <div v-if="selectedResume">
            <div class="resume-title-summary-area">
              <!-- 제목 1줄 + 버튼 -->
              <div class="resume-title">
                <span class="title-text">{{ selectedResume.title }}</span>
                <v-btn @click="onEditTitle">수정하기</v-btn>
              </div>

              <!-- 요약 1줄 + 버튼 -->
              <div class="resume-summary">
                <p class="summary-text">{{ selectedResume.summary }}</p>
                <v-btn @click="onEditSummary">수정하기</v-btn>
              </div>
            </div>
            <div class="resume-items-section-area">
              <div class="section-card">
                <div class="section-header">
                  <h3 class="section-title">학력</h3>
                  <v-btn @click="onEditEducation"> 수정하기 </v-btn>
                </div>

                <ResumeTable
                  :columns="educationColumns"
                  :items="selectedResume.educations"
                />
              </div>

              <!-- 경력 섹션 -->
              <div class="section-card">
                <div class="section-header">
                  <h3 class="section-title">경력</h3>
                  <v-btn @click="onEditExperience"> 수정하기 </v-btn>
                </div>

                <ResumeTable
                  :columns="experienceColumns"
                  :items="selectedResume.experiences"
                />
              </div>
              <!-- 기술 섹션 -->
              <div class="section-card">
                <div class="section-header">
                  <h3 class="section-title">기술</h3>
                  <v-btn @click="onEditSkill"> 수정하기 </v-btn>
                </div>

                <ResumeTable
                  :columns="skillColumns"
                  :items="selectedResume.skills"
                />
              </div>
              <!-- 자격증 섹션 -->
              <div class="section-card">
                <div class="section-header">
                  <h3 class="section-title">자격증</h3>
                  <v-btn @click="onEditCertificate"> 수정하기 </v-btn>
                </div>

                <ResumeTable
                  :columns="certificateColumns"
                  :items="selectedResume.certificates"
                />
              </div>
              <!-- 언어 섹션 -->
              <div class="section-card">
                <div class="section-header">
                  <h3 class="section-title">어학</h3>
                  <v-btn @click="onEditLanguage"> 수정하기 </v-btn>
                </div>

                <ResumeTable
                  :columns="languageColumns"
                  :items="selectedResume.languages"
                />
              </div>
            </div>
          </div>
          <div v-else class="no-resume"></div>
        </div>
      </div>
    </section>
  </div>
</template>
