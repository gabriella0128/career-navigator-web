export async function useLoading<T>(
  asyncFunction: () => Promise<T>
): Promise<T> {
  const { showModal, hideModal } = useModal();
  showModal({
    id: "loading-modal",
    title: "Loading",
    category: "common",
    component: "LoadingModal",
    persistent: true,
  });

  try {
    return await asyncFunction();
  } finally {
    hideModal("loading-modal");
  }
}
