import { FileUploadHandlerEvent } from "primereact/fileupload";
import { RootStore, useRootStore } from "../../stores/RootStore";
import { LogListStoreState } from "../../stores/LogListStore";
import { SelectedLogsInfoStoreState } from "../../stores/SelectedLogsInfoStore";

export type ILogListViewModel = ReturnType<typeof LogListViewModel>;

export const LogListViewModel = (rootStore?: RootStore) => {
  const { logListStore, filterStateStore, selectedLogsInfoStore } =
    rootStore ?? useRootStore();
  return {
    hasError: () => logListStore.hasError || selectedLogsInfoStore.hasError,
    error: () => logListStore.error ?? selectedLogsInfoStore.error,
    canBeRetried: () => logListStore.errorCanRetry,
    onClose: () => logListStore.error && logListStore.updateLogList(),

    minAllowedTimestamp: () => logListStore.minTimestamp,
    maxAllowedTimestamp: () => logListStore.maxTimestamp,
    minSelectedTimestamp: () => filterStateStore.selected_min_timestamp,
    maxSelectedTimestamp: () => filterStateStore.selected_max_timestamp,
    onMinSelectionChange: filterStateStore.setMinTimestamp,
    onMaxSelectionChange: filterStateStore.setMaxTimestamp,

    logUploadHandler: (e: FileUploadHandlerEvent) => {
      logListStore.uploadLogFile(e.files[0]);
      e.options.clear();
    },
    onLogListRefreshClick: logListStore.updateLogList,

    isListLoading: () => logListStore.state != LogListStoreState.idle,
    logFiles: () => logListStore.logs,
    deleteFile: (filename: string) => () =>
      logListStore.deleteLogFile(filename),
    isLogListEmpty: () => !logListStore.hasLogs,

    isInfoLoading: () =>
      selectedLogsInfoStore.state == SelectedLogsInfoStoreState.loading,
    totalEntriesCount: () => selectedLogsInfoStore.info?.total_entries,
    avgEntriesCount: () => selectedLogsInfoStore.info?.avg_entries,
    entryStdDev: () => selectedLogsInfoStore.info?.entries_std_dev,
    maxCountEntryInfo: () => selectedLogsInfoStore.info?.max_count_entry,
  };
};
