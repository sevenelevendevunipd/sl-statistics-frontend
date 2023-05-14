import { action, makeObservable, observable, runInAction } from "mobx";

import { ApiError, ChartsService } from "../openapi";
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
  get hasError(): boolean;
}

function reprError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.body.errors instanceof Array) {
      return err.body.errors.join("\n");
    } else {
      return JSON.stringify(err.body);
    }
  } else if (err instanceof TypeError) {
    return err.message;
  } else {
    return `${err}`;
  }
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

  throwError(err: string) {
    runInAction(() => {
      this.state = ChartFilterStoreState.error;
      this.error = err;
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
          this.throwError(
            `Error while getting log file list: ${reprError(err)}`
          );
        });
        console.error(err); //TODO: Controllare gli handle errors
      }
    );
  }

  get hasError() {
    return this.state == ChartFilterStoreState.error;
  }
}
