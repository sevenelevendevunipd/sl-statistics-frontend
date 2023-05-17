import { ListBoxChangeEvent } from "primereact/listbox";
import { useRootStore } from "../../stores/RootStore";
import { runInAction } from "mobx";
import { groupBy, hashUnitSubUnit, splitUnitSubUnitHash } from "../../utils";
import { TreeCheckboxSelectionKeys, TreeSelectionEvent } from "primereact/tree";

export type ITimeChartViewModel = ReturnType<typeof TimeChartViewModel>;

export const TimeChartViewModel = () => {
  const { timeChartDataStore, chartFilterStore } = useRootStore();
  return {
    chartData: () => timeChartDataStore.data,
    selectableCodes: () => chartFilterStore.selectableCodes,
    selectedCodes: () => timeChartDataStore.selectedCodes,
    disableCodeOption: (option: string) =>
      timeChartDataStore.selectedCodes.length >= 7 &&
      !timeChartDataStore.selectedCodes.includes(option),
    onCodeSelectionChange: (e: ListBoxChangeEvent) =>
      runInAction(() => (timeChartDataStore.selectedCodes = e.value)),

    selectableSubunits: () => {
      const groupedUnitSubunits = groupBy(
        chartFilterStore.selectableSubunits.map(splitUnitSubUnitHash),
        (e) => e[0]
      );
      return Object.keys(groupedUnitSubunits).map((unit) => ({
        key: unit.toString(),
        label: `Unit ${unit}`,
        children: groupedUnitSubunits[parseInt(unit)].map((subUnit) => ({
          key: `s${hashUnitSubUnit(parseInt(unit), subUnit[1])}`,
          label: `Unit ${unit} SubUnit ${subUnit[1]}`,
        })),
      }));
    },
    selectedSubunits: () => timeChartDataStore.selectedSubUnits,
    onSubunitSelectionChange: (e: TreeSelectionEvent) =>
      runInAction(
        () =>
          (timeChartDataStore.selectedSubUnits =
            e.value as TreeCheckboxSelectionKeys)
      ),

    hasError: () => chartFilterStore.hasError || chartFilterStore.hasError,
    error: () => chartFilterStore.error ?? chartFilterStore.error,
  };
};
