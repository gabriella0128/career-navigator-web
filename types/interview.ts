export interface QuestionRes {
  questionIdx: number;
  position: number | null;
  question: string | null;
  difficulty: number;
  answered: boolean;
}
export type ModalMode = "waiting" | "answered";

export interface QuestionDetailRes {
  questionIdx: number;
  question: string | null;
  position: number | null;
  answer: string | null;
  scoreOverall: number | null;
  scores: string | null;
  feedback: string | null;
  strength: string | null;
  improvements: string | null;
}

export interface QuestionDetailReq {
  questionIdx: number | null;
}

export interface AnswerInsertReq {
  questionIdx: number | null;
  answer: string;
}
