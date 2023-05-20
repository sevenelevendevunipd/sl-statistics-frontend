import { RootStore, useRootStore } from "../stores/RootStore";

export type IMainViewViewModel = ReturnType<typeof MainViewViewModel>;

export const MainViewViewModel = (rootStore?: RootStore) => {
  const { logListStore, selectedLogsInfoStore } = rootStore ?? useRootStore();
  return {
    updateLogList: () => logListStore.updateLogList(),
    tabsDisabled: () =>
      !logListStore.hasLogs ||
      (selectedLogsInfoStore.info?.total_entries ?? 0) == 0,
  };
};
