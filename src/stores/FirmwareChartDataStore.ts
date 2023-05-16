import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import { ApiError, ChartsService } from "../openapi";

enum FirmwareChartStoreState {
  idle,
  waiting,
  error,
}

export default interface IFirmwareChartDataStore {
  state: FirmwareChartStoreState;
  error: string | undefined;

  selectedCodes: string[];
  selectedFirmwares: string[];

  data: Record<string, string>[];

  update(start: Date, end: Date, allFirmwares: string[]): void;
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

export class FirmwareChartDataStore implements IFirmwareChartDataStore {
  state: FirmwareChartStoreState = FirmwareChartStoreState.idle;
  error: string | undefined = undefined;

  selectedCodes: string[] = [];
  selectedFirmwares: string[] = [];

  data: Record<string, string>[] = [];

  constructor() {
    makeObservable(this, {
      state: observable,
      error: observable,
      selectedCodes: observable,
      selectedFirmwares: observable,
      data: observable,
      throwError: action.bound,
      update: action.bound,
      hasError: computed,
    });
  }

  throwError(err: string) {
    this.state = FirmwareChartStoreState.error;
    this.error = err;
  }

  update(start: Date, end: Date, allFirmwares: string[]) {
    this.error = undefined;
    this.state = FirmwareChartStoreState.waiting;
    ChartsService.postApiChartsFirmware({
      start: start.toISOString(),
      end: end.toISOString(),
      selected_codes: this.selectedCodes,
      selected_firmwares:
        this.selectedFirmwares.length == 0
          ? allFirmwares
          : this.selectedFirmwares,
    }).then(
      (data) => {
        runInAction(() => {
          this.data = data.bars;
          this.state = FirmwareChartStoreState.idle;
        });
      },
      (err) => {
        runInAction(() => {
          this.throwError(
            `Error while getting log file list: ${reprError(err)}`
          );
        });
        console.error(err); //TODO: Controllare gli handle
      }
    );
  }

  get hasError() {
    return this.state == FirmwareChartStoreState.error;
  }
}
