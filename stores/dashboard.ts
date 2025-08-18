import { defineStore } from "pinia";
import type { CommonResponse } from "~/types/common";
import type { DashboardRes } from "~/types/dashboard";
import { DashboardAPI } from "~/api/dashboardAPI";
import type { ApiObject } from "~/types/api";

export const useDashboardStore = defineStore("dashboard", () => {
  const dashboardData = ref<DashboardRes>();

  const updateDashboardCurrent = async (
    result: CommonResponse<DashboardRes> | null | void
  ) => {
    if (!result) return;
    dashboardData.value = result.data ?? [];
  };

  const retrieveDashboard: () => ApiObject<DashboardRes> = () => {
    const apiDesc = "대시보드 조회";
    const { data, error, execute } = useCallAPI<CommonResponse<DashboardRes>>(
      DashboardAPI.RETRIEVE_DASHBOARD,
      null,
      updateDashboardCurrent
    );
    return { data, error, execute, apiDesc };
  };

  return {
    dashboardData,

    retrieveDashboard,
  };
});
