import { ListBoxChangeEvent } from "primereact/listbox";
import { RootStore, useRootStore } from "../../stores/RootStore";
import { runInAction } from "mobx";

export type IFirmwareChartViewModel = ReturnType<typeof FirmwareChartViewModel>;

export const FirmwareChartViewModel = (rootStore?: RootStore) => {
  const { firmwareChartDataStore, chartFilterStore } =
    rootStore ?? useRootStore();
  return {
    chartData: () => firmwareChartDataStore.data,
    selectableCodes: () => chartFilterStore.selectableCodes,
    selectedCodes: () => firmwareChartDataStore.selectedCodes,
    disableCodeOption: (option: string) =>
      firmwareChartDataStore.selectedCodes.length >= 7 &&
      !firmwareChartDataStore.selectedCodes.includes(option),
    onCodeSelectionChange: (e: ListBoxChangeEvent) =>
      runInAction(() => (firmwareChartDataStore.selectedCodes = e.value)),

    selectableFirmwares: () => chartFilterStore.selectableFirmwares,
    selectedFirmwares: () => firmwareChartDataStore.selectedFirmwares,
    onFirmwareSelectionChange: (e: ListBoxChangeEvent) =>
      runInAction(() => (firmwareChartDataStore.selectedFirmwares = e.value)),

    hasError: () =>
      chartFilterStore.hasError || firmwareChartDataStore.hasError,
    error: () => chartFilterStore.error ?? firmwareChartDataStore.error,
  };
};
