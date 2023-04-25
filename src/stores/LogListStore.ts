import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import {
  ApiError,
  LogFileManagementService,
  StoredLogList_c682361_StoredLogFile,
} from "../openapi";
import { MAX_DATE, MIN_DATE } from "../utils";

type StoredLogFile = StoredLogList_c682361_StoredLogFile;

export enum LogListStoreState {
  idle,
  waiting,
  retryableError,
  error,
}

export default interface ILogListStore {
  state: LogListStoreState;
  logs: StoredLogFile[];
  minTimestamp: Date;
  maxTimestamp: Date;
  error: string | undefined;

  updateLogList(): void;
  uploadLogFile(log: File): void;
  deleteLogFile(name: string): void;
  get hasLogs(): boolean;
  get hasError(): boolean;
  get errorCanRetry(): boolean;
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

export class LogListStore implements ILogListStore {
  state: LogListStoreState = LogListStoreState.idle;
  logs: StoredLogFile[] = [];
  minTimestamp: Date = new Date(MIN_DATE);
  maxTimestamp: Date = new Date(MAX_DATE);
  error: string | undefined = undefined;

  constructor() {
    makeObservable(this, {
      state: observable,
      logs: observable,
      minTimestamp: observable,
      maxTimestamp: observable,
      error: observable,
      throwError: false,
      updateLogList: action.bound,
      uploadLogFile: action.bound,
      deleteLogFile: action.bound,
      hasLogs: computed,
      hasError: computed,
      errorCanRetry: computed,
    });
  }

  throwError(err: string, retryable = false) {
    runInAction(() => {
      this.state = retryable
        ? LogListStoreState.retryableError
        : LogListStoreState.error;
      this.error = err;
    });
  }
  updateLogList() {
    this.error = undefined;
    this.state = LogListStoreState.waiting;
    LogFileManagementService.getApiLogList().then(
      (value) => {
        runInAction(() => {
          this.state = LogListStoreState.idle;
          this.logs = value.log_files;
          this.minTimestamp = new Date(value.min_timestamp);
          this.maxTimestamp = new Date(value.max_timestamp);
        });
      },
      (err) => {
        this.throwError(
          `Error while getting log file list: ${reprError(err)}`,
          true
        );
      }
    );
  }

  uploadLogFile(log: File) {
    LogFileManagementService.putApiLog({ log }).then(
      this.updateLogList,
      (err) => {
        this.throwError(`Error while uploading log file: ${reprError(err)}`);
      }
    );
  }

  deleteLogFile(name: string) {
    this.state = LogListStoreState.waiting;
    LogFileManagementService.deleteApiLog({ log: name }).then(
      this.updateLogList,
      (err) => {
        this.throwError(`Error while deleting log file: ${reprError(err)}`);
      }
    );
  }

  get hasLogs() {
    return this.logs.length != 0;
  }

  get hasError() {
    return (
      this.state == LogListStoreState.error ||
      this.state == LogListStoreState.retryableError
    );
  }

  get errorCanRetry() {
    return this.state == LogListStoreState.retryableError;
  }
}
