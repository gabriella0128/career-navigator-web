import { defineStore } from "pinia";
import type { CommonResponse } from "~/types/common";
import type {
  QuestionRes,
  ModalMode,
  QuestionDetailRes,
  QuestionDetailReq,
  AnswerInsertReq,
} from "~/types/interview";
import { InterviewAPI } from "~/api/interviewAPI";
import type { ApiObject } from "~/types/api";

export const useInterviewStore = defineStore("interview", () => {
  const modalMode = ref<ModalMode>("waiting");

  const dailyQuestions = ref<QuestionRes[]>([]);

  const dailyQuestionDetail = ref<QuestionDetailRes>();

  const dailyQuestionDetailReq = ref<QuestionDetailReq>({
    questionIdx: null,
  });

  const answerInsertReq = ref<AnswerInsertReq>({
    questionIdx: null,
    answer: "",
  });

  const updateDailyQuestiontAnswerInsertReq = (questionIdx: number) => {
    answerInsertReq.value.questionIdx = questionIdx;
  };

  const updateDailyQuestionDetailReq = (questionIdx: number) => {
    dailyQuestionDetailReq.value.questionIdx = questionIdx;
  };

  const updateDailyQuestionsCurrent = async (
    result: CommonResponse<QuestionRes[]> | null | void
  ) => {
    if (!result) return;
    dailyQuestions.value = result.data ?? [];
  };

  const updateDailyQuestionDetailCurrent = async (
    result: CommonResponse<QuestionDetailRes> | null | void
  ) => {
    if (!result) return;
    dailyQuestionDetail.value = result.data ?? [];
  };

  const retrieveDailyQuestion: () => ApiObject<QuestionRes[]> = () => {
    const apiDesc = "오늘자 면접 질문 조회";
    const { data, error, execute } = useCallAPI<CommonResponse<QuestionRes[]>>(
      InterviewAPI.RETRIEVE_DAILY_QUESTION,
      null,
      updateDailyQuestionsCurrent
    );
    return { data, error, execute, apiDesc };
  };

  const generateDailyQuestion: () => ApiObject<null> = () => {
    const apiDesc = "오늘자 면접 질문 생성";
    const { data, error, execute } = useCallAPI<CommonResponse<null>>(
      InterviewAPI.GENERATE_QUESTION
    );
    return { data, error, execute, apiDesc };
  };

  const retrieveDailyQuestionDetail: () => ApiObject<QuestionDetailRes> =
    () => {
      const apiDesc = "면접 질문 상세 조회";
      const { data, error, execute } = useCallAPI<
        CommonResponse<QuestionDetailRes>
      >(
        InterviewAPI.RETRIEVE_DAILY_QUESTION_DETAIL,
        dailyQuestionDetailReq.value,
        updateDailyQuestionDetailCurrent
      );
      return { data, error, execute, apiDesc };
    };

  const generateDailyQuestionAnswer: () => ApiObject<null> = () => {
    const apiDesc = "오늘자 면접 질문 답변 생성";
    const { data, error, execute } = useCallAPI<CommonResponse<null>>(
      InterviewAPI.GENERATE_ANSWER,
      answerInsertReq.value
    );
    return { data, error, execute, apiDesc };
  };
  return {
    modalMode,
    dailyQuestions,
    dailyQuestionDetail,
    answerInsertReq,

    updateDailyQuestionDetailReq,
    updateDailyQuestiontAnswerInsertReq,

    retrieveDailyQuestion,
    generateDailyQuestion,
    retrieveDailyQuestionDetail,
    generateDailyQuestionAnswer,
  };
});
