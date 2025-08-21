import { defineStore } from "pinia";
import type { CommonResponse } from "~/types/common";
import {
  type ModalMode,
  type DetailResumeReq,
  type DetailResumeRes,
  type InsertResumeReq,
  type ResumeItem,
  type EducationReq,
  type ExperienceReq,
  type SkillReq,
  type CertificateReq,
  type LanguageReq,
  type ValidationError,
  type ResumeListItem,
} from "~/types/resume";
import { ResumeAPI } from "~/api/resumeAPI";
import type { ApiObject } from "~/types/api";

export const useResumeStore = defineStore("resume", () => {
  const modalMode = ref<ModalMode>("register");
  const selectedUpdateItem = ref<ResumeItem>("title");

  const selectedResume = ref<DetailResumeRes>({
    resumeIdx: null,
    title: null,
    summary: null,
    educations: [],
    experiences: [],
    skills: [],
    certificates: [],
    languages: [],
  });

  const selectedResumeList = ref<ResumeListItem[]>([]);

  const updateResumeTitleReq = ref<string | null>("");
  const updateResumeSummaryReq = ref<string | null>("");
  const updateResumeEducationReq = ref<EducationReq[]>([]);
  const updateResumeExperienceReq = ref<ExperienceReq[]>([]);
  const updateResumeSkillReq = ref<SkillReq[]>([]);
  const updateResumeCertificateReq = ref<CertificateReq[]>([]);
  const updateResumeLanguageReq = ref<LanguageReq[]>([]);

  const insertResumeReq = ref<InsertResumeReq>({
    title: "",
    summary: "",
    educations: [],
    experiences: [],
    skills: [],
    certificates: [],
    languages: [],
  });

  const updateDetailResumeReq = (resumeIdx: number) => {
    detailResumeReq.value.resumeIdx = resumeIdx;
  };

  const detailResumeReq = ref<DetailResumeReq>({
    resumeIdx: null,
  });

  const resetInsertResumeReq = () => {
    insertResumeReq.value = {
      title: "",
      summary: "",
      educations: [],
      experiences: [],
      skills: [],
      certificates: [],
      languages: [],
    };
  };

  const resetUpdateResumeTitleReq = () => {
    updateResumeTitleReq.value = selectedResume.value.title;
  };

  const resetUpdateResumeSummaryReq = () => {
    updateResumeSummaryReq.value = selectedResume.value.summary;
  };

  const resetUpdateResumeEducationReq = () => {
    updateResumeEducationReq.value = selectedResume.value.educations;
  };
  const resetUpdateResumeExperienceReq = () => {
    updateResumeExperienceReq.value = selectedResume.value.experiences;
  };
  const resetUpdateResumeSkillReq = () => {
    updateResumeSkillReq.value = selectedResume.value.skills;
  };
  const resetUpdateResumeCertificateReq = () => {
    updateResumeCertificateReq.value = selectedResume.value.certificates;
  };
  const resetUpdateResumeLanguageReq = () => {
    updateResumeLanguageReq.value = selectedResume.value.languages;
  };

  const updateResumeDetailCurrent = async (
    result: CommonResponse<DetailResumeRes> | null | void
  ) => {
    if (!result) return;
    selectedResume.value = result.data;
  };

  const updateResumeListCurrent = async (
    result: CommonResponse<ResumeListItem[]> | null | void
  ) => {
    if (!result) return;
    selectedResumeList.value = result.data;
  };

  // validation start
  const isBlank = (v: unknown): v is null | undefined | "" =>
    v === null || v === undefined || (typeof v === "string" && v.trim() === "");

  const hasAnyValue = <T extends object>(
    obj: Partial<T>,
    ignoreKeys: ReadonlyArray<keyof T> = []
  ): boolean => {
    const keys = Object.keys(obj) as Array<keyof T>;
    return keys.some((k) => !ignoreKeys.includes(k) && !isBlank(obj[k]));
  };

  const isExistingRow = <T extends object>(
    item: Partial<T>,
    idKeys: ReadonlyArray<keyof T>
  ): boolean => idKeys.some((k) => !isBlank(item[k]));

  const validateSection = <T extends object>(
    list: ReadonlyArray<Partial<T>> | null | undefined,
    sectionName: string,
    requiredIfAny: ReadonlyArray<keyof T>,
    opts: {
      ignoreKeys?: ReadonlyArray<keyof T>;
      idKeys?: ReadonlyArray<keyof T>;
      /** 값도 id도 없는 완전 빈 행 금지 (기본 true) */
      disallowEmptyRow?: boolean;
    } = {}
  ): ValidationError[] => {
    const errors: ValidationError[] = [];
    const items = Array.isArray(list) ? list : [];
    const ignoreKeys = opts.ignoreKeys ?? [];
    const idKeys = opts.idKeys ?? [];
    const disallowEmptyRow = opts.disallowEmptyRow ?? true;

    items.forEach((item, idx) => {
      const exists = isExistingRow(item, idKeys);
      const hasValue = hasAnyValue(item, ignoreKeys);

      if (!exists && !hasValue) {
        if (disallowEmptyRow) {
          errors.push({
            path: `${sectionName}[${idx}]`,
            message: `${sectionName} ${idx + 1}번 행이 비어있습니다. 필수값을 입력하거나 행을 삭제하세요.`,
          });
        }
        return;
      }

      requiredIfAny.forEach((field) => {
        const value = item[field];
        if (isBlank(value)) {
          errors.push({
            path: `${sectionName}[${idx}].${String(field)}`,
            message: `${sectionName} ${idx + 1}번 행의 ${String(field)}은(는) 필수입니다.`,
          });
        }
      });
    });

    return errors;
  };
  const insertResume: () => ApiObject<void> = () => {
    const apiDesc = "이력서 신규등록";
    const { data, error, execute } = useCallAPI<CommonResponse<void>>(
      ResumeAPI.INSERT_RESUME,
      insertResumeReq.value
    );
    return { data, error, execute, apiDesc };
  };

  const updateTitle: () => ApiObject<void> = () => {
    const apiDesc = "이력서 제목 수정";
    const { data, error, execute } = useCallAPI<CommonResponse<void>>(
      ResumeAPI.UPDATE_TITLE,
      {
        resumeIdx: selectedResume.value.resumeIdx,
        title: updateResumeTitleReq.value,
      }
    );
    return { data, error, execute, apiDesc };
  };

  const updateSummary: () => ApiObject<void> = () => {
    const apiDesc = "이력서 요약 수정";
    const { data, error, execute } = useCallAPI<CommonResponse<void>>(
      ResumeAPI.UPDATE_SUMMARY,
      {
        resumeIdx: selectedResume.value.resumeIdx,
        summary: updateResumeSummaryReq.value,
      }
    );
    return { data, error, execute, apiDesc };
  };

  const updateEducation: () => ApiObject<void> = () => {
    const apiDesc = "이력서 교육 수정";
    const { data, error, execute } = useCallAPI<CommonResponse<void>>(
      ResumeAPI.UPDATE_EDUCATION,
      {
        resumeIdx: selectedResume.value.resumeIdx,
        educations: updateResumeEducationReq.value,
      }
    );
    return { data, error, execute, apiDesc };
  };

  const updateExperience: () => ApiObject<void> = () => {
    const apiDesc = "이력서 경력 수정";
    const { data, error, execute } = useCallAPI<CommonResponse<void>>(
      ResumeAPI.UPDATE_EXPERIENCE,
      {
        resumeIdx: selectedResume.value.resumeIdx,
        experiences: updateResumeExperienceReq.value,
      }
    );
    return { data, error, execute, apiDesc };
  };

  const updateSkill: () => ApiObject<void> = () => {
    const apiDesc = "이력서 기술 수정";
    const { data, error, execute } = useCallAPI<CommonResponse<void>>(
      ResumeAPI.UPDATE_SKILL,
      {
        resumeIdx: selectedResume.value.resumeIdx,
        skills: updateResumeSkillReq.value,
      }
    );
    return { data, error, execute, apiDesc };
  };

  const updateCertificate: () => ApiObject<void> = () => {
    const apiDesc = "이력서 자격증 수정";
    const { data, error, execute } = useCallAPI<CommonResponse<void>>(
      ResumeAPI.UPDATE_CERTIFICATE,
      {
        resumeIdx: selectedResume.value.resumeIdx,
        certificates: updateResumeCertificateReq.value,
      }
    );
    return { data, error, execute, apiDesc };
  };

  const updateLanguage: () => ApiObject<void> = () => {
    const apiDesc = "이력서 어학 수정";
    const { data, error, execute } = useCallAPI<CommonResponse<void>>(
      ResumeAPI.UPDATE_LANGUAGE,
      {
        resumeIdx: selectedResume.value.resumeIdx,
        languages: updateResumeLanguageReq.value,
      }
    );
    return { data, error, execute, apiDesc };
  };

  const updateResume: () => ApiObject<void> = () => {
    switch (selectedUpdateItem.value) {
      case "title":
        return updateTitle();
      case "summary":
        return updateSummary();
      case "education":
        return updateEducation();
      case "experience":
        return updateExperience();
      case "skill":
        return updateSkill();
      case "certificate":
        return updateCertificate();
      case "language":
        return updateLanguage();
      default:
        throw new Error("수정할 항목이 선택되지 않았습니다.");
    }
  };

  const retrieveResumeDetail: () => ApiObject<DetailResumeRes> = () => {
    const apiDesc = "이력서 상세 조회";
    const { data, error, execute } = useCallAPI<
      CommonResponse<DetailResumeRes>
    >(
      ResumeAPI.RETRIEVE_RESUME,
      detailResumeReq.value,
      updateResumeDetailCurrent
    );
    return { data, error, execute, apiDesc };
  };

  const changeResume: () => ApiObject<void> = () => {
    const apiDesc = "대표 이력서 변경";
    const { data, error, execute } = useCallAPI<CommonResponse<void>>(
      ResumeAPI.CHANGE_RESUME,
      detailResumeReq.value
    );
    return { data, error, execute, apiDesc };
  };

  const retrieveResumeList: () => ApiObject<ResumeListItem[]> = () => {
    const apiDesc = "이력서 목록 조회 성공";
    const { data, error, execute } = useCallAPI<
      CommonResponse<ResumeListItem[]>
    >(ResumeAPI.RETRIEVE_RESUME_LIST, null, updateResumeListCurrent);
    return { data, error, execute, apiDesc };
  };
  return {
    // state
    selectedResume,
    insertResumeReq,
    detailResumeReq,
    modalMode,
    selectedUpdateItem,
    selectedResumeList,

    updateResumeTitleReq,
    updateResumeSummaryReq,
    updateResumeEducationReq,
    updateResumeExperienceReq,
    updateResumeSkillReq,
    updateResumeCertificateReq,
    updateResumeLanguageReq,

    // actions
    updateResumeDetailCurrent,
    resetInsertResumeReq,
    resetUpdateResumeTitleReq,
    resetUpdateResumeSummaryReq,
    resetUpdateResumeEducationReq,
    resetUpdateResumeExperienceReq,
    resetUpdateResumeSkillReq,
    resetUpdateResumeCertificateReq,
    resetUpdateResumeLanguageReq,
    validateSection,
    isBlank,
    updateDetailResumeReq,

    // api call
    retrieveResumeDetail,
    insertResume,
    updateResume,
    changeResume,
    retrieveResumeList,
  };
});
