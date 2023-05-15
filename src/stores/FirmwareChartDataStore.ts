import { action, makeObservable, observable, runInAction } from "mobx";

import { ChartsService } from "../openapi";

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
      update: action.bound,
    });
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
          this.state = FirmwareChartStoreState.error;
        });
        console.error(err); //TODO: handle
      }
    );
  }
}
