import {
  makeObservable,
  observable,
  action,
  computed,
  runInAction,
  reaction,
} from "mobx";
import {
  DefaultService,
  LogFrequency_baae32a_LogFrequencyEntry,
} from "../openapi";
import { MIN_DATE, MAX_DATE, hashUnitSubUnit } from "../utils";
import { TreeCheckboxSelectionKeys } from "primereact/tree";
import TreeNode from "primereact/treenode";
import { SelectItemOptionsType } from "primereact/selectitem";

export enum LogFrequencyStoreState {
  idle,
  waiting,
  error,
}

export default interface ILogFrequencyStore {
  state: LogFrequencyStoreState;
  error: string | undefined;

  entry_frequencies: LogFrequency_baae32a_LogFrequencyEntry[];
  selected_min_timestamp: Date;
  selected_max_timestamp: Date;

  selected_subunits: TreeCheckboxSelectionKeys;

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

export class LogFrequencyStore implements ILogFrequencyStore {
  state: LogFrequencyStoreState = LogFrequencyStoreState.idle;
  error: string | undefined;

  entry_frequencies: LogFrequency_baae32a_LogFrequencyEntry[] = [];
  selected_min_timestamp: Date = new Date(MIN_DATE);
  selected_max_timestamp: Date = new Date(MAX_DATE);

  selected_subunits: TreeCheckboxSelectionKeys =
    selectAllTreeEntries(allUnitSubunits);

  constructor() {
    makeObservable(this, {
      state: observable,
      error: observable,
      entry_frequencies: observable,
      selected_min_timestamp: observable,
      selected_max_timestamp: observable,
      selected_subunits: observable,
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
        this.selected_min_timestamp,
        this.selected_max_timestamp,
        this.selectedSubunitIds,
      ],
      this.updateFrequencies
    );
  }

  setSelectedRange(min: Date, max: Date) {
    this.selected_min_timestamp = min;
    this.selected_max_timestamp = max;
  }

  setMinTimestamp(min: Date) {
    this.selected_min_timestamp = min;
  }

  setMaxTimestamp(max: Date) {
    this.selected_max_timestamp = max;
  }

  setSubunitSelection(selection: TreeCheckboxSelectionKeys) {
    this.selected_subunits = selection;
  }

  updateFrequencies() {
    this.error = undefined;
    this.state = LogFrequencyStoreState.waiting;
    DefaultService.postApiFrequency({
      start: this.selected_min_timestamp.toISOString(),
      end: this.selected_max_timestamp.toISOString(),
      selected_subunits: this.selectedSubunitIds,
    }).then(
      (value) => {
        runInAction(() => {
          this.state = LogFrequencyStoreState.idle;
          this.entry_frequencies = value.entries;
        });
      },
      (error) => {
        runInAction(() => {
          this.state = LogFrequencyStoreState.error;
        });
        //TODO: handle errors.
        console.log(error);
      }
    );
  }

  get hasError() {
    return this.state == LogFrequencyStoreState.error;
  }

  get firmwares() {
    return [...new Set(this.entry_frequencies.map((v) => v.firmware))].sort();
  }

  get firmwareFilter() {
    return this.firmwares.map((f) => ({ name: f, code: f }));
  }

  get selectedSubunitIds() {
    return [
      ...Object.keys(this.selected_subunits)
        .filter((k) => k.startsWith("s"))
        .map((k) => parseInt(k.substring(1))),
    ];
  }
}
