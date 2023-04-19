import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { DefaultService, LogOverview_91de17a } from "../openapi";

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

  updateOverview(start: Date, end: Date) {
    this.error = undefined;
    this.state = SelectedLogsInfoStoreState.loading;
    DefaultService.getApiOverview(start.toISOString(), end.toISOString()).then(
      (value) => {
        runInAction(() => {
          this.state = SelectedLogsInfoStoreState.idle;
          this.info = value;
        });
      },
      (error) => {
        runInAction(() => {
          this.state = SelectedLogsInfoStoreState.error;
        });
        //TODO: handle errors.
        console.log(error);
      }
    );
  }

  get hasError() {
    return this.state == SelectedLogsInfoStoreState.error;
  }
}
