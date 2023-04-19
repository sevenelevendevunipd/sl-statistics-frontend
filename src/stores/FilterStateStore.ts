import { makeObservable, observable, action } from "mobx";
import { MAX_DATE, MIN_DATE } from "../utils";

export default interface IFilterStateStore {
  selected_min_timestamp: Date;
  selected_max_timestamp: Date;

  setSelectedRange(min: Date, max: Date): void;
  setMinTimestamp(min: Date): void;
  setMaxTimestamp(min: Date): void;
}

export class FilterStateStore implements IFilterStateStore {
  selected_min_timestamp: Date = new Date(MIN_DATE);
  selected_max_timestamp: Date = new Date(MAX_DATE);

  constructor() {
    makeObservable(this, {
      selected_min_timestamp: observable,
      selected_max_timestamp: observable,
      setSelectedRange: action.bound,
      setMinTimestamp: action.bound,
      setMaxTimestamp: action.bound,
    });
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
}
