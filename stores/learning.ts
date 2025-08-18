import { defineStore } from "pinia";
import type { CommonResponse } from "~/types/common";
import type { LearningPlanRes } from "~/types/learning";
import { LearningAPI } from "~/api/learningAPI";
import type { ApiObject } from "~/types/api";

export const useLearningStore = defineStore("learning", () => {
  const learningPlan = ref<LearningPlanRes>();

  const updateLearningPlanCurrent = async (
    result: CommonResponse<LearningPlanRes> | null | void
  ) => {
    if (!result) return;
    learningPlan.value = result.data ?? [];
  };

  const retrieveLearningPlan: () => ApiObject<LearningPlanRes> = () => {
    const apiDesc = "이 달의 학습 계획 조회";
    const { data, error, execute } = useCallAPI<
      CommonResponse<LearningPlanRes>
    >(LearningAPI.RETRIEVE_LEARNING_PLAN, null, updateLearningPlanCurrent);
    return { data, error, execute, apiDesc };
  };

  const generateLearningPlan: () => ApiObject<null> = () => {
    const apiDesc = "이 달의 학습 계획 생성";
    const { data, error, execute } = useCallAPI<CommonResponse<null>>(
      LearningAPI.GENERATE_LEARNING_PLAN
    );
    return { data, error, execute, apiDesc };
  };

  return {
    learningPlan,

    retrieveLearningPlan,
    generateLearningPlan,
  };
});
