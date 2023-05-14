import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";
import { SelectItemOptionsType } from "primereact/selectitem";
import { TreeCheckboxSelectionKeys } from "primereact/tree";
import TreeNode from "primereact/treenode";

import {
  ApiError, 
  LogAggregationAnalysisService,
  LogFrequency_baae32a_LogFrequencyEntry,
} from "../openapi";
import { MAX_DATE, MIN_DATE, hashUnitSubUnit } from "../utils";

export enum LogFrequencyStoreState {
  idle,
  waiting,
  error,
}

export default interface ILogFrequencyStore {
  state: LogFrequencyStoreState;
  error: string | undefined;

  entryFrequencies: LogFrequency_baae32a_LogFrequencyEntry[];
  selectedMinTimestamp: Date;
  selectedMaxTimestamp: Date;

  selectedSubunits: TreeCheckboxSelectionKeys;

  setSelectedRange(min: Date, max: Date): void;
  setMinTimestamp(min: Date): void;
  setMaxTimestamp(min: Date): void;

  setSubunitSelection(selection: TreeCheckboxSelectionKeys): void;

  updateFrequencies(): void;
  get hasError(): boolean;
  get firmwares(): string[];
  get firmwareFilter(): SelectItemOptionsType;
  get selectedSubunitIds(): number[];
}

export const allUnitSubunits: TreeNode[] = Array.from(Array(16).keys()).map(
  (unit) => ({
    key: unit.toString(),
    label: `Unit ${unit}`,
    children: Array.from(Array(16).keys()).map((subUnit) => ({
      key: `s${hashUnitSubUnit(unit, subUnit)}`,
      label: `Unit ${unit} SubUnit ${subUnit}`,
    })),
  })
);

function selectTreeEntry(
  entry: TreeNode,
  selectedEntries: TreeCheckboxSelectionKeys
): void {
  selectedEntries[entry.key!] = { partialChecked: false, checked: true }; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  entry.children?.forEach((child) => selectTreeEntry(child, selectedEntries));
}

function selectAllTreeEntries(entries: TreeNode[]) {
  const selectedEntries: TreeCheckboxSelectionKeys = {};
  entries.forEach((entry) => {
    selectTreeEntry(entry, selectedEntries);
  });
  return selectedEntries;
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

export class LogFrequencyStore implements ILogFrequencyStore {
  state: LogFrequencyStoreState = LogFrequencyStoreState.idle;
  error: string | undefined;

  entryFrequencies: LogFrequency_baae32a_LogFrequencyEntry[] = [];
  selectedMinTimestamp: Date = new Date(MIN_DATE);
  selectedMaxTimestamp: Date = new Date(MAX_DATE);

  selectedSubunits: TreeCheckboxSelectionKeys =
    selectAllTreeEntries(allUnitSubunits);

  constructor() {
    makeObservable(this, {
      state: observable,
      error: observable,
      entryFrequencies: observable,
      selectedMinTimestamp: observable,
      selectedMaxTimestamp: observable,
      selectedSubunits: observable,
      setSelectedRange: action.bound,
      setMinTimestamp: action.bound,
      setMaxTimestamp: action.bound,
      setSubunitSelection: action.bound,
      updateFrequencies: action.bound,
      hasError: computed,
      firmwares: computed,
      firmwareFilter: computed,
      selectedSubunitIds: computed,
    });
    reaction(
      () => [
        this.selectedMinTimestamp,
        this.selectedMaxTimestamp,
        this.selectedSubunitIds,
      ],
      this.updateFrequencies
    );
  }

  throwError(err: string) {
    runInAction(() => {
      this.state = LogFrequencyStoreState.error;
      this.error = err;
    });
  }

  setSelectedRange(min: Date, max: Date) {
    this.selectedMinTimestamp = min;
    this.selectedMaxTimestamp = max;
  }

  setMinTimestamp(min: Date) {
    this.selectedMinTimestamp = min;
  }

  setMaxTimestamp(max: Date) {
    this.selectedMaxTimestamp = max;
  }

  setSubunitSelection(selection: TreeCheckboxSelectionKeys) {
    this.selectedSubunits = selection;
  }

  updateFrequencies() {
    this.error = undefined;
    this.state = LogFrequencyStoreState.waiting;
    LogAggregationAnalysisService.postApiFrequency({
      start: this.selectedMinTimestamp.toISOString(),
      end: this.selectedMaxTimestamp.toISOString(),
      selected_subunits: this.selectedSubunitIds,
    }).then(
      (value) => {
        runInAction(() => {
          this.state = LogFrequencyStoreState.idle;
          this.entryFrequencies = value.entries;
        });
      },
      (error) => {
        runInAction(() => {
          this.throwError(
            `Error while getting log file list: ${reprError(error)}`
          );
        });
        //TODO: Controlla gli handle errors.
        console.log(error);
      }
    );
  }

  get hasError() {
    return this.state == LogFrequencyStoreState.error;
  }

  get firmwares() {
    return [...new Set(this.entryFrequencies.map((v) => v.firmware))].sort();
  }

  get firmwareFilter() {
    return this.firmwares.map((f) => ({ name: f, code: f }));
  }

  get selectedSubunitIds() {
    return [
      ...Object.keys(this.selectedSubunits)
        .filter((k) => k.startsWith("s"))
        .map((k) => parseInt(k.substring(1))),
    ];
  }
}
