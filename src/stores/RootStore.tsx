import { reaction } from "mobx";
import { PropsWithChildren, createContext, useContext } from "react";

import { restrictRange } from "../utils";
import IChartFilterStore, { ChartFilterStore } from "./ChartFilterStore";
import IFilterStateStore, { FilterStateStore } from "./FilterStateStore";
import ILogFrequencyStore, { LogFrequencyStore } from "./LogFrequencyStore";
import ILogListStore, { LogListStore } from "./LogListStore";
import ISelectedLogsInfoStore, {
  SelectedLogsInfoStore,
} from "./SelectedLogsInfoStore";
import ITimeChartDataStore, { TimeChartDataStore } from "./TimeChartDataStore";
import IFirmwareChartDataStore, {
  FirmwareChartDataStore,
} from "./FirmwareChartDataStore";

export class RootStore {
  readonly logListStore: ILogListStore;
  readonly filterStateStore: IFilterStateStore;
  readonly selectedLogsInfoStore: ISelectedLogsInfoStore;
  readonly logFrequencyStore: ILogFrequencyStore;
  readonly chartFilterStore: IChartFilterStore;
  readonly timeChartDataStore: ITimeChartDataStore;
  readonly firmwareChartDataStore: IFirmwareChartDataStore;

  constructor(
    logListStore: ILogListStore | null = null,
    filterStateStore: IFilterStateStore | null = null,
    selectedLogsInfoStore: ISelectedLogsInfoStore | null = null,
    logFrequencyStore: ILogFrequencyStore | null = null,
    chartFilterStore: IChartFilterStore | null = null,
    timeChartStore: ITimeChartDataStore | null = null,
    firmwareChartDataStore: IFirmwareChartDataStore | null = null
  ) {
    this.logListStore = logListStore ?? new LogListStore();
    this.filterStateStore = filterStateStore ?? new FilterStateStore();
    this.selectedLogsInfoStore =
      selectedLogsInfoStore ?? new SelectedLogsInfoStore();
    this.logFrequencyStore = logFrequencyStore ?? new LogFrequencyStore();
    this.chartFilterStore = chartFilterStore ?? new ChartFilterStore();
    this.timeChartDataStore = timeChartStore ?? new TimeChartDataStore();
    this.firmwareChartDataStore =
      firmwareChartDataStore ?? new FirmwareChartDataStore();
    reaction(
      () => {
        const logsStore = this.logListStore;
        return [logsStore.minTimestamp, logsStore.maxTimestamp];
      },
      ([min_timestamp, max_timestamp]) => {
        const filterStore = this.filterStateStore;
        filterStore.setSelectedRange(
          ...restrictRange(
            min_timestamp,
            max_timestamp,
            filterStore.selected_min_timestamp,
            filterStore.selected_max_timestamp
          )
        );
      }
    );
    reaction(
      () => {
        const filterStore = this.filterStateStore;
        return [
          filterStore.selected_min_timestamp,
          filterStore.selected_max_timestamp,
        ] as [Date, Date];
      },
      (bounds) => {
        this.selectedLogsInfoStore.updateOverview(...bounds);
        const {
          selectedMinTimestamp: selected_min_timestamp,
          selectedMaxTimestamp: selected_max_timestamp,
        } = this.logFrequencyStore;
        this.logFrequencyStore.setSelectedRange(
          ...restrictRange(
            ...bounds,
            selected_min_timestamp,
            selected_max_timestamp
          )
        );
        this.chartFilterStore.update(...bounds);
        this.timeChartDataStore.update(
          ...bounds,
          this.chartFilterStore.selectableSubunits
        );
        this.firmwareChartDataStore.update(
          ...bounds,
          this.chartFilterStore.selectableFirmwares
        );
      }
    );
    reaction(
      () => this.chartFilterStore.selectableSubunits,
      (selectableSubunits) => {
        const filterStore = this.filterStateStore;
        this.timeChartDataStore.update(
          filterStore.selected_min_timestamp,
          filterStore.selected_max_timestamp,
          selectableSubunits
        );
      }
    );
    reaction(
      () => this.chartFilterStore.selectableFirmwares,
      (selectableFirmwares) => {
        const filterStore = this.filterStateStore;
        this.firmwareChartDataStore.update(
          filterStore.selected_min_timestamp,
          filterStore.selected_max_timestamp,
          selectableFirmwares
        );
      }
    );
    reaction(
      () => {
        const timeChart = this.timeChartDataStore;
        return [timeChart.selectedCodes, timeChart.selectedSubUnitsList] as [
          string[],
          number[]
        ];
      },
      () => {
        const filterStore = this.filterStateStore;
        const chartFilter = this.chartFilterStore;
        this.timeChartDataStore.update(
          filterStore.selected_min_timestamp,
          filterStore.selected_max_timestamp,
          chartFilter.selectableSubunits
        );
      }
    );
    reaction(
      () => {
        const firmwareChart = this.firmwareChartDataStore;
        return [firmwareChart.selectedCodes, firmwareChart.selectedFirmwares];
      },
      () => {
        const filterStore = this.filterStateStore;
        const chartFilter = this.chartFilterStore;
        this.firmwareChartDataStore.update(
          filterStore.selected_min_timestamp,
          filterStore.selected_max_timestamp,
          chartFilter.selectableFirmwares
        );
      }
    );
  }
}

const RootStoreContext = createContext<RootStore | undefined>(undefined);

const RootStoreProvider = (props: PropsWithChildren) => {
  const rootStore = new RootStore();
  return (
    <RootStoreContext.Provider value={rootStore}>
      {props.children}
    </RootStoreContext.Provider>
  );
};

export default RootStoreProvider;

export const useRootStore = () => {
  const context = useContext(RootStoreContext);
  if (context === undefined) {
    throw new Error("Caller is not a child of RootStoreProvider.");
  }
  return context;
};
