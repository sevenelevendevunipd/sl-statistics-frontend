import { action, makeObservable, observable, runInAction } from "mobx";

import { ChartsService } from "../openapi";
enum ChartFilterStoreState {
  idle,
  waiting,
  error,
}

export default interface IChartFilterStore {
  state: ChartFilterStoreState;
  error: string | undefined;

  selectableCodes: string[];
  selectableSubunits: number[];
  selectableFirmwares: string[];

  update(start: Date, end: Date): void;
}

export class ChartFilterStore implements IChartFilterStore {
  state: ChartFilterStoreState = ChartFilterStoreState.idle;
  error: string | undefined = undefined;

  selectableCodes: string[] = [];
  selectableSubunits: number[] = [];
  selectableFirmwares: string[] = [];

  constructor() {
    makeObservable(this, {
      state: observable,
      error: observable,
      selectableCodes: observable,
      selectableSubunits: observable,
      selectableFirmwares: observable,
      update: action,
    });
  }

  update(start: Date, end: Date): void {
    this.state = ChartFilterStoreState.waiting;
    this.error = undefined;
    ChartsService.getApiChartsFilters(
      start.toISOString(),
      end.toISOString()
    ).then(
      (data) => {
        runInAction(() => {
          this.state = ChartFilterStoreState.idle;
          this.selectableCodes = data.codes;
          this.selectableFirmwares = data.firmwares;
          this.selectableSubunits = data.subunits;
        });
      },
      (err) => {
        runInAction(() => {
          this.state = ChartFilterStoreState.error;
        });
        console.error(err); //TODO: handle errors
      }
    );
  }
}
