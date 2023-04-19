import { TabView, TabPanel } from "primereact/tabview";

import LogListView from "./LogListView";
import { useRootStore } from "../stores/RootStore";
import { observer } from "mobx-react-lite";
import ILogListStore from "../stores/LogListStore";
import { useEffect } from "react";
import ISelectedLogsInfoStore from "../stores/SelectedLogsInfoStore";
import LogFrequencyView from "./LogFrequencyView";

type ObserverProps = {
  logListStore: ILogListStore;
  selectedLogsInfoStore: ISelectedLogsInfoStore;
};

const EmptyLogListObserver = observer(
  ({ logListStore, selectedLogsInfoStore }: ObserverProps) => {
    const disableTabs =
      !logListStore.hasLogs ||
      (selectedLogsInfoStore.info?.total_entries ?? 0) == 0;
    return (
      <TabView className="h-full" panelContainerClassName="surface-50">
        <TabPanel
          header="Uploaded log list"
          leftIcon="pi pi-folder-open mr-2"
          className="surface-50"
        >
          <LogListView />
        </TabPanel>
        <TabPanel
          header="Entries frequency"
          leftIcon="pi pi-list mr-2"
          disabled={disableTabs}
        >
          <LogFrequencyView />
        </TabPanel>
        <TabPanel
          header="Visualize"
          leftIcon="pi pi-chart-bar mr-2"
          disabled={disableTabs}
        >
          <h1>TODO: add charts</h1>
        </TabPanel>
      </TabView>
    );
  }
);

const MainView = () => {
  const { logListStore, selectedLogsInfoStore } = useRootStore();
  useEffect(() => {
    logListStore.updateLogList();
  });
  return (
    <EmptyLogListObserver
      logListStore={logListStore}
      selectedLogsInfoStore={selectedLogsInfoStore}
    />
  );
};

export default MainView;
