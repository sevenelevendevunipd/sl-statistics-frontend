/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartFilterStore } from "../../../stores/ChartFilterStore";
import { TimeChartDataStore } from "../../../stores/TimeChartDataStore";
import { ITimeChartViewModel, TimeChartViewModel } from "../TimeChartViewModel";

jest.mock("../../../stores/ChartFilterStore");
jest.mock("../../../stores/TimeChartDataStore");

describe("TimeChartViewModel", () => {
  let timeChartDataStore: jest.Mocked<TimeChartDataStore>;
  let chartFilterStore: jest.Mocked<ChartFilterStore>;
  let rootStore;
  let viewModel: ITimeChartViewModel;

  beforeEach(() => {
    timeChartDataStore = new TimeChartDataStore() as any;
    chartFilterStore = new ChartFilterStore() as any;
    rootStore = {
      timeChartDataStore,
      chartFilterStore,
    };
    viewModel = TimeChartViewModel(rootStore as any);
  });

  it("chartData", () => {
    const chartData = Symbol() as any;
    Object.defineProperty(timeChartDataStore, "data", { value: chartData });
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
    Object.defineProperty(timeChartDataStore, "selectedCodes", {
      value: selectedCodes,
    });
    expect(viewModel.selectedCodes()).toBe(selectedCodes);
  });

  describe("disableCodeOption", () => {
    it("less than 7 elements selected", () => {
      timeChartDataStore.selectedCodes = ["a", "b", "c"];
      expect(viewModel.disableCodeOption("c")).toBe(false);
      expect(viewModel.disableCodeOption("d")).toBe(false);
    });
    describe("7 elements selected", () => {
      beforeEach(() => {
        timeChartDataStore.selectedCodes = ["a", "b", "c", "d", "e", "f", "g"];
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
    expect(timeChartDataStore.selectedCodes).toBe(selection);
  });

  it("selectableSubunits", () => {
    const selectableSubunits = [5, 16];
    Object.defineProperty(chartFilterStore, "selectableSubunits", {
      value: selectableSubunits,
    });
    const subunits = viewModel.selectableSubunits();
    expect(subunits[0].key).toBe("0");
    expect(subunits[0].children[0].key).toBe("s5");
    expect(subunits[1].key).toBe("1");
    expect(subunits[1].children[0].key).toBe("s16");
  });

  it("selectedSubunits", () => {
    const selectedSubunits = Symbol() as any;
    Object.defineProperty(timeChartDataStore, "selectedSubUnits", {
      value: selectedSubunits,
    });
    expect(viewModel.selectedSubunits()).toBe(selectedSubunits);
  });

  it("onSubunitSelectionChange", () => {
    const selection = Symbol();
    viewModel.onSubunitSelectionChange({ value: selection } as any);
    expect(timeChartDataStore.selectedSubUnits).toBe(selection);
  });

  describe("hasError", () => {
    it("no error", () => {
      Object.defineProperty(chartFilterStore, "hasError", { value: false });
      Object.defineProperty(timeChartDataStore, "hasError", {
        value: false,
      });
      expect(viewModel.hasError()).toBe(false);
    });
    it("filter error", () => {
      Object.defineProperty(chartFilterStore, "hasError", { value: true });
      Object.defineProperty(timeChartDataStore, "hasError", {
        value: false,
      });
      expect(viewModel.hasError()).toBe(true);
    });
  });

  describe("error", () => {
    it("undefined on no error", () => {
      Object.defineProperty(chartFilterStore, "hasError", { value: false });
      Object.defineProperty(timeChartDataStore, "hasError", {
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
