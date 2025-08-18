import { defineStore } from "pinia";
import type { CommonResponse } from "~/types/common";
import type {
  CheckIdDuplicationRequest,
  CheckIdDuplicationResponse,
  SignupRequest,
} from "~/types/signup";
import { UserAPI } from "~/api/userAPI";
import type { ApiObject } from "~/types/api";

export const useSignupStore = defineStore("signup", () => {
  const signupInfo: Ref<SignupRequest> = ref({
    userId: "", // 사용자 아이디
    userPasswd: "", // 비밀번호
    userEmail: "", // 이메일
    userName: "", // 이름
  });

  const fieldRules: Record<string, ((v: string) => true | string)[]> = {
    userId: [
      (v: string) =>
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,20}$/.test(v) ||
        "아이디가 유효하지 않습니다.",
    ],
    userPasswd: [
      (v: string) =>
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(
          v
        ) || "비밀번호가 유효하지 않습니다.",
    ],
    userEmail: [
      (v: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "이메일이 유효하지 않습니다.",
    ],
    userName: [
      (v: string) =>
        /^[a-zA-Z가-힣]{2,}$/.test(v) || "이름이 유효하지 않습니다.",
    ],
  };

  const validationStatus = computed(() => {
    const status: Partial<Record<keyof SignupRequest, boolean>> = {};
    for (const key in signupInfo.value) {
      const typedKey = key as keyof SignupRequest;
      const value = signupInfo.value[typedKey] || "";
      const rules = fieldRules[typedKey];

      status[typedKey] = rules
        ? rules.every((rule) => rule(value) === true)
        : true;
    }
    return status;
  });

  const validationMessages = computed(() => {
    const messages: Record<string, string[]> = {};
    for (const key in signupInfo) {
      const typedKey = key as keyof SignupRequest;
      const value = signupInfo.value[typedKey] || "";
      const rules = fieldRules[typedKey];
      if (rules) {
        const isValid = rules.every((rule) => rule(value) === true);
        messages[key] = isValid
          ? []
          : rules.map((rule) => rule(value)).filter((msg) => msg !== true);
      } else {
        messages[key] = [];
      }
    }
    return messages;
  });

  const confirmedId = ref<string>("");

  const checkIdDuplicationInfo: Ref<CheckIdDuplicationRequest> = ref({
    // 아이디 중복 여부 확인 요청 api body 값
    userId: "",
  });

  const updateUserIdCheckIdDuplicationInfo = (userId: string) => {
    checkIdDuplicationInfo.value.userId = userId;
  };

  const updateConfirmedId = (id: string) => {
    confirmedId.value = id;
  };

  const isSignupInfoValid = () => {
    return Object.values(validationStatus.value).every((valid) => valid);
  };

  const resetSignupInfo = () => {
    signupInfo.value = {
      userId: "", // 사용자 아이디
      userPasswd: "", // 비밀번호
      userEmail: "", // 이메일
      userName: "", // 이름
    };
  };

  const checkIdDuplication: () => ApiObject<CheckIdDuplicationResponse> =
    () => {
      const apiDesc = "아이디 중복 확인";
      const { data, error, execute } = useCallAPI<
        CommonResponse<CheckIdDuplicationResponse>
      >(UserAPI.CHECK_ID, checkIdDuplicationInfo.value);
      return { data, error, execute, apiDesc };
    };

  const signupUser: () => ApiObject<void> = () => {
    const apiDesc = "회원가입";
    const { data, error, execute } = useCallAPI<CommonResponse<void>>(
      UserAPI.SIGNUP_USER,
      signupInfo.value
    );
    return { data, error, execute, apiDesc };
  };

  return {
    // state
    signupInfo,
    confirmedId,
    validationStatus,
    validationMessages,
    // actions
    updateUserIdCheckIdDuplicationInfo,
    updateConfirmedId,
    isSignupInfoValid,
    resetSignupInfo,
    // api call
    checkIdDuplication,
    signupUser,
  };
});
