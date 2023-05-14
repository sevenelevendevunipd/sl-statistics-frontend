import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import { ApiError, LogAggregationAnalysisService, LogOverview_91de17a } from "../openapi";

export enum SelectedLogsInfoStoreState {
  idle,
  loading,
  error,
}

type State = SelectedLogsInfoStoreState;

export default interface ISelectedLogsInfoStore {
  state: State;
  error: string | undefined;

  info: LogOverview_91de17a | undefined;

  updateOverview(start: Date, end: Date): void;
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

export class SelectedLogsInfoStore implements ISelectedLogsInfoStore {
  state: State = SelectedLogsInfoStoreState.idle;
  error: string | undefined = undefined;

  info: LogOverview_91de17a | undefined;

  constructor() {
    makeObservable(this, {
      state: observable,
      error: observable,
      info: observable,
      updateOverview: action.bound,
      hasError: computed,
    });
  }

  throwError(err: string) {
    runInAction(() => {
      this.state = SelectedLogsInfoStoreState.error;
      this.error = err;
    });
  }

  updateOverview(start: Date, end: Date) {
    this.error = undefined;
    this.state = SelectedLogsInfoStoreState.loading;
    LogAggregationAnalysisService.getApiOverview(
      start.toISOString(),
      end.toISOString()
    ).then(
      (value) => {
        runInAction(() => {
          this.state = SelectedLogsInfoStoreState.idle;
          this.info = value;
        });
      },
      (error) => {
        runInAction(() => {
          this.throwError(
            `Error while getting log file list: ${reprError(error)}`
          );
        });
        //TODO: Controllare gli handle errors.
        console.log(error);
      }
    );
  }

  get hasError() {
    return this.state == SelectedLogsInfoStoreState.error;
  }
}
