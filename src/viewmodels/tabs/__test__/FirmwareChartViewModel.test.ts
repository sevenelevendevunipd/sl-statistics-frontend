/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartFilterStore } from "../../../stores/ChartFilterStore";
import { FirmwareChartDataStore } from "../../../stores/FirmwareChartDataStore";
import {
  IFirmwareChartViewModel,
  FirmwareChartViewModel,
} from "../FirmwareChartViewModel";

jest.mock("../../../stores/ChartFilterStore");
jest.mock("../../../stores/FirmwareChartDataStore");

describe("FirmwareChartViewModel", () => {
  let firmwareChartDataStore: jest.Mocked<FirmwareChartDataStore>;
  let chartFilterStore: jest.Mocked<ChartFilterStore>;
  let rootStore;
  let viewModel: IFirmwareChartViewModel;

  beforeEach(() => {
    firmwareChartDataStore = new FirmwareChartDataStore() as any;
    chartFilterStore = new ChartFilterStore() as any;
    rootStore = {
      firmwareChartDataStore,
      chartFilterStore,
    };
    viewModel = FirmwareChartViewModel(rootStore as any);
  });

  it("chartData", () => {
    const chartData = Symbol() as any;
    Object.defineProperty(firmwareChartDataStore, "data", { value: chartData });
    expect(viewModel.chartData()).toBe(chartData);
  });

  it("selectableCodes", () => {
    const selectableCodes = Symbol() as any;
    Object.defineProperty(chartFilterStore, "selectableCodes", {
      value: selectableCodes,
    });
    expect(viewModel.selectableCodes()).toBe(selectableCodes);
  });

  it("selectedCodes", () => {
    const selectedCodes = Symbol() as any;
    Object.defineProperty(firmwareChartDataStore, "selectedCodes", {
      value: selectedCodes,
    });
    expect(viewModel.selectedCodes()).toBe(selectedCodes);
  });

  describe("disableCodeOption", () => {
    it("less than 7 elements selected", () => {
      firmwareChartDataStore.selectedCodes = ["a", "b", "c"];
      expect(viewModel.disableCodeOption("c")).toBe(false);
      expect(viewModel.disableCodeOption("d")).toBe(false);
    });
    describe("7 elements selected", () => {
      beforeEach(() => {
        firmwareChartDataStore.selectedCodes = [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
        ];
      });
      it("can't select non selected code", () => {
        expect(viewModel.disableCodeOption("x")).toBe(true);
      });
      it("can deselect currently selected code", () => {
        expect(viewModel.disableCodeOption("d")).toBe(false);
      });
    });
  });

  it("onCodeSelectionChange", () => {
    const selection = Symbol();
    viewModel.onCodeSelectionChange({ value: selection } as any);
    expect(firmwareChartDataStore.selectedCodes).toBe(selection);
  });

  it("selectableFirmwares", () => {
    const selectableFirmwares = Symbol() as any;
    Object.defineProperty(chartFilterStore, "selectableFirmwares", {
      value: selectableFirmwares,
    });
    expect(viewModel.selectableFirmwares()).toBe(selectableFirmwares);
  });

  it("selectedFirmwares", () => {
    const selectedFirmwares = Symbol() as any;
    Object.defineProperty(firmwareChartDataStore, "selectedFirmwares", {
      value: selectedFirmwares,
    });
    expect(viewModel.selectedFirmwares()).toBe(selectedFirmwares);
  });

  it("onFirmwareSelectionChange", () => {
    const selection = Symbol();
    viewModel.onFirmwareSelectionChange({ value: selection } as any);
    expect(firmwareChartDataStore.selectedFirmwares).toBe(selection);
  });

  describe("hasError", () => {
    it("no error", () => {
      Object.defineProperty(chartFilterStore, "hasError", { value: false });
      Object.defineProperty(firmwareChartDataStore, "hasError", {
        value: false,
      });
      expect(viewModel.hasError()).toBe(false);
    });
    it("filter error", () => {
      Object.defineProperty(chartFilterStore, "hasError", { value: true });
      Object.defineProperty(firmwareChartDataStore, "hasError", {
        value: false,
      });
      expect(viewModel.hasError()).toBe(true);
    });
  });

  describe("error", () => {
    it("undefined on no error", () => {
      Object.defineProperty(chartFilterStore, "hasError", { value: false });
      Object.defineProperty(firmwareChartDataStore, "hasError", {
        value: false,
      });
      expect(viewModel.error()).toBeUndefined();
    });
    it("defined on error", () => {
      const error = "lol";
      Object.defineProperty(chartFilterStore, "hasError", { value: true });
      Object.defineProperty(chartFilterStore, "error", {
        value: error,
      });
      expect(viewModel.error()).toBe(error);
    });
  });
});
