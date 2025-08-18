import type { CommonResponse } from "~/types/common";
import type { UserInfo } from "~/types/user";
import { UserAPI } from "~/api/userAPI";
import type { ApiObject } from "~/types/api";

export const useUserStore = defineStore(
  "user",
  () => {
    const roles = ref<string[]>([]);
    const userInfo = ref<UserInfo>({
      userIdx: 0,
      userId: "",
      userName: "",
      userEmail: "",
    });

    const updateUserDetailCurrent = (
      result: CommonResponse<UserInfo> | null | void
    ) => {
      if (!result) return;
      userInfo.value = result.data ?? [];
    };

    const resetUserSessionStorage = () => sessionStorage.removeItem("user");

    const retrieveUser: () => ApiObject<UserInfo> = () => {
      const apiDesc = "유저정보 조회";
      const { data, error, execute } = useCallAPI<CommonResponse<UserInfo>>(
        UserAPI.RETRIEVE_USER,
        null,
        updateUserDetailCurrent
      );
      return { data, error, execute, apiDesc };
    };

    return {
      roles,
      userInfo,
      resetUserSessionStorage,
      retrieveUser,
    };
  },
  {
    persist: {
      storage: sessionStorage,
      pick: ["roles", "userInfo"],
    },
  }
);
