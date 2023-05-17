import { TreeCheckboxSelectionKeys, TreeSelectionEvent } from "primereact/tree";
import { allUnitSubunits } from "../../stores/LogFrequencyStore";
import { RootStore, useRootStore } from "../../stores/RootStore";


export type ILogFrequencyViewModel = ReturnType<typeof LogFrequencyViewModel>;

export const LogFrequencyViewModel = (rootStore?: RootStore) => {
  const { logFrequencyStore, filterStateStore } = rootStore ?? useRootStore();
  return {
    hasError: () => logFrequencyStore.hasError,
    error: () => logFrequencyStore.error,

    minAllowedTimestamp: () => filterStateStore.selected_min_timestamp,
    maxAllowedTimestamp: () => filterStateStore.selected_max_timestamp,
    minSelectedTimestamp: () => logFrequencyStore.selectedMinTimestamp,
    maxSelectedTimestamp: () => logFrequencyStore.selectedMaxTimestamp,
    onMinSelectionChange: logFrequencyStore.setMinTimestamp,
    onMaxSelectionChange: logFrequencyStore.setMaxTimestamp,

    selectableSubunits: allUnitSubunits,
    selectedSubunits: () => logFrequencyStore.selectedSubunits,
    onSubunitSelectionChange: (e: TreeSelectionEvent) => logFrequencyStore.setSubunitSelection(e.value as TreeCheckboxSelectionKeys),

    selectableFirmwares: () => logFrequencyStore.firmwares,

    entryFrequencies: () => logFrequencyStore.entryFrequencies,
  };
}