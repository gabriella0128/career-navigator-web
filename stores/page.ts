import { ref } from 'vue';
import type { Paging } from '~/types/common';

export const usePageStore = defineStore('page', () => {
  // variable
  const pageInfo = ref<Paging>({
    totalCount: 0,
    totalPageCount: 1,
    pageNo: 1,
    pageSize: 10
  });

  return {
    // variable
    pageInfo
  };
});
