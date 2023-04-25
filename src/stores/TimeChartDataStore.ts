import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { TreeCheckboxSelectionKeys } from "primereact/tree";

import { ChartsService } from "../openapi";

enum TimeChartStoreState {
  idle,
  waiting,
  error,
}

export default interface ITimeChartDataStore {
  state: TimeChartStoreState;
  error: string | undefined;

  selectedCodes: string[];
  selectedSubUnits: TreeCheckboxSelectionKeys;

  data: Record<string, string>[];

  update(start: Date, end: Date, allSubunits: number[]): void;

  get selectedSubUnitsList(): number[];
}

export class TimeChartDataStore implements ITimeChartDataStore {
  state: TimeChartStoreState = TimeChartStoreState.idle;
  error: string | undefined = undefined;

  selectedCodes: string[] = [];
  selectedSubUnits: TreeCheckboxSelectionKeys = {};

  data: Record<string, string>[] = [];

  constructor() {
    makeObservable(this, {
      state: observable,
      error: observable,
      selectedCodes: observable,
      selectedSubUnits: observable,
      data: observable,
      update: action.bound,
      selectedSubUnitsList: computed,
    });
  }

  update(start: Date, end: Date, allSubunits: number[]) {
    this.error = undefined;
    this.state = TimeChartStoreState.waiting;
    ChartsService.postApiChartsTime({
      start: start.toISOString(),
      end: end.toISOString(),
      selected_codes: this.selectedCodes,
      selected_subunits:
        this.selectedSubUnitsList.length == 0
          ? allSubunits
          : this.selectedSubUnitsList,
    }).then(
      (data) => {
        runInAction(() => {
          this.data = data.bars;
          this.state = TimeChartStoreState.idle;
        });
      },
      (err) => {
        runInAction(() => {
          this.state = TimeChartStoreState.error;
        });
        console.error(err);
      }
    );
  }
  get selectedSubUnitsList() {
    return [
      ...Object.keys(this.selectedSubUnits)
        .filter((k) => k.startsWith("s"))
        .map((k) => parseInt(k.substring(1))),
    ];
  }
}
