import { useAuthStore } from '~/stores/auth';
import { useUserStore } from '~/stores/user';

/**
 *    페이지 이동 시 실행되는 전역 미들웨어
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  const { isPageAuthenticated } = storeToRefs(authStore);
  const { pageAuthCheck, updatePageUrl, resetTokenSessionStorage } = authStore;
  const { resetUserSessionStorage } = userStore;

  const pathWhiteList = ['/error', '/login', '/signup', '/admin/login']; // 인증에서 제외되는 경로
  const isPathAllowed = (): boolean => {
    return pathWhiteList.some((entry) => to.path.startsWith(entry));
    // return pathWhiteList.includes(to.path)
  };

  if (isPathAllowed()) {
    // if (to.path !== "/") {
    resetTokenSessionStorage();
    resetUserSessionStorage();
    // }
  } else {
    const accessToken = sessionStorage.getItem('accessToken') || '';

    if (!accessToken) {
      resetTokenSessionStorage();
      if (to.path.startsWith('/admin')) {
        return navigateTo('/admin/login');
      }
      return navigateTo('/login');
    }

    updatePageUrl(to.path);

    await pageAuthCheck();

    if (!isPageAuthenticated.value) {
      resetTokenSessionStorage();
      if (to.path.startsWith('/admin')) {
        return navigateTo('/admin/login');
      }
      return navigateTo('/login');
    }
  }
});
