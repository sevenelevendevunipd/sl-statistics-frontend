import { PropsWithChildren, createContext, useContext } from "react";
import ILogListStore, { LogListStore } from "./LogListStore";
import IFilterStateStore, { FilterStateStore } from "./FilterStateStore";
import { reaction } from "mobx";
import { restrictRange } from "../utils";
import ISelectedLogsInfoStore, {
  SelectedLogsInfoStore,
} from "./SelectedLogsInfoStore";
import ILogFrequencyStore, { LogFrequencyStore } from "./LogFrequencyStore";

export class RootStore {
  readonly logListStore: ILogListStore;
  readonly filterStateStore: IFilterStateStore;
  readonly selectedLogsInfoStore: ISelectedLogsInfoStore;
  readonly logFrequencyStore: ILogFrequencyStore;

  constructor(
    logListStore: ILogListStore | null = null,
    filterStateStore: IFilterStateStore | null = null,
    selectedLogsInfoStore: ISelectedLogsInfoStore | null = null,
    logFrequencyStore: ILogFrequencyStore | null = null
  ) {
    this.logListStore = logListStore ?? new LogListStore();
    this.filterStateStore = filterStateStore ?? new FilterStateStore();
    this.selectedLogsInfoStore =
      selectedLogsInfoStore ?? new SelectedLogsInfoStore();
    this.logFrequencyStore = logFrequencyStore ?? new LogFrequencyStore();
    reaction(
      () => {
        const logsStore = this.logListStore;
        return [logsStore.min_timestamp, logsStore.max_timestamp];
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
        const { selected_min_timestamp, selected_max_timestamp } =
          this.logFrequencyStore;
        this.logFrequencyStore.setSelectedRange(
          ...restrictRange(
            ...bounds,
            selected_min_timestamp,
            selected_max_timestamp
          )
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
