export interface InsertResumeReq {
  title: string;
  summary: string;
  educations: EducationReq[];
  experiences: ExperienceReq[];
  skills: SkillReq[];
  certificates: CertificateReq[];
  languages: LanguageReq[];
}

export interface DetailResumeReq {
  resumeIdx: number | null;
}

export interface DetailResumeRes {
  resumeIdx: number | null;
  title: string | null;
  summary: string | null;
  educations: EducationRes[];
  experiences: ExperienceRes[];
  skills: SkillRes[];
  certificates: CertificateRes[];
  languages: LanguageRes[];
}

export type ModalMode = "register" | "update";

export type ResumeItem =
  | "title"
  | "summary"
  | "education"
  | "experience"
  | "skill"
  | "certificate"
  | "language";

export type ValidationError = { path: string; message: string };
// resume inner req

export interface EducationReq {
  educationIdx: number | null;
  schoolName: string;
  degree: string | null;
  major: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface ExperienceReq {
  experienceIdx: number | null;
  companyName: string;
  position: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface SkillReq {
  skillIdx: number | null;
  skillName: string;
  proficiency: string | null;
}

export interface CertificateReq {
  certificateIdx: number | null;
  certificateName: string;
  issueBy: string | null;
  issueDate: string | null;
}

export interface LanguageReq {
  languageIdx: number | null;
  languageName: string;
  level: string | null;
  testName: string | null;
  testScore: string | null;
}

// resume inner res

export interface EducationRes {
  educationIdx: number | null;
  schoolName: string;
  degree: string | null;
  major: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface ExperienceRes {
  experienceIdx: number | null;
  companyName: string;
  position: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface SkillRes {
  skillIdx: number | null;
  skillName: string;
  proficiency: string | null;
}

export interface CertificateRes {
  certificateIdx: number | null;
  certificateName: string;
  issueBy: string | null;
  issueDate: string | null;
}

export interface LanguageRes {
  languageIdx: number | null;
  languageName: string;
  level: string | null;
  testName: string | null;
  testScore: string | null;
}

export interface UpdateTitleReq {
  resumeIdx: number;
  title: string;
}

export interface UpdateSummaryReq {
  resumeIdx: number;
  summary: string;
}

export interface UpdateEducationReq {
  resumeIdx: number;
  educations: EducationReq[];
}

export interface UpdateSkillReq {
  resumeIdx: number;
  skills: SkillReq[];
}

export interface UpdateCertificateReq {
  resumeIdx: number;
  certificates: CertificateReq[];
}

export interface UpdateLanguageReq {
  resumeIdx: number;
  languages: LanguageReq[];
}

export interface ResumeListItem {
  resumeIdx: number;
  title: string;
  createDt: string;
}
