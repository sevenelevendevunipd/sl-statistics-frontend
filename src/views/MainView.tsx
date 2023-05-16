import { TabPanel, TabView } from "primereact/tabview";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import LogFrequencyView from "./tabs/LogFrequencyView";
import LogListView from "./tabs/LogListView";
import TimeChartView from "./tabs/TimeChartView";
import FirmwareChartView from "./tabs/FirmwareChartView";
import { MaybeViewModelProps, ViewModelProps } from "../utils";
import { IMainViewViewModel, MainViewViewModel } from "../viewmodels/MainViewViewModel";

const DisabledTabsObserver = observer(
  ({ viewModel }: ViewModelProps<IMainViewViewModel>) => {
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
          disabled={viewModel.tabsDisabled()}
        >
          <LogFrequencyView />
        </TabPanel>
        <TabPanel
          header="Time/Occurences Chart"
          leftIcon="pi pi-chart-bar mr-2"
          disabled={viewModel.tabsDisabled()}
        >
          <TimeChartView />
        </TabPanel>
        <TabPanel
          header="Firmware/Occurences Chart"
          leftIcon="pi pi-chart-bar mr-2"
          disabled={viewModel.tabsDisabled()}
        >
          <FirmwareChartView />
        </TabPanel>
      </TabView>
    );
  }
);

const MainView = (props: MaybeViewModelProps<IMainViewViewModel>) => {
  const viewModel = props.viewModel ?? MainViewViewModel();
  useEffect(() => {
    viewModel.updateLogList();
  });
  return (
    <DisabledTabsObserver
      viewModel={viewModel}
    />
  );
};

export default MainView;
