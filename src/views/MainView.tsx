import { TabPanel, TabView } from "primereact/tabview";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import ILogListStore from "../stores/LogListStore";
import { useRootStore } from "../stores/RootStore";
import ISelectedLogsInfoStore from "../stores/SelectedLogsInfoStore";
import LogFrequencyView from "./tabs/LogFrequencyView";
import LogListView from "./tabs/LogListView";
import TimeChartView from "./tabs/TimeChartView";
import FirmwareChartView from "./tabs/FirmwareChartView";

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
          header="Time/Occurences Chart"
          leftIcon="pi pi-chart-bar mr-2"
          disabled={disableTabs}
        >
          <TimeChartView />
        </TabPanel>
        <TabPanel
          header="Firmware/Occurences Chart"
          leftIcon="pi pi-chart-bar mr-2"
          disabled={disableTabs}
        >
          <FirmwareChartView />
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
