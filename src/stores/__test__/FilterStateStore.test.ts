import { FilterStateStore } from '../FilterStateStore';

describe("FilterStateStore", () => {
  let filterStateStore: FilterStateStore;

  beforeEach(() => {
    filterStateStore = new FilterStateStore();
  });

  it("sets the selected range", () => {
    const min = new Date(2023, 0, 1);
    const max = new Date(2023, 0, 15);
    filterStateStore.setSelectedRange(min, max);
    expect(filterStateStore.selected_min_timestamp).toEqual(min);
    expect(filterStateStore.selected_max_timestamp).toEqual(max);
  });

  it("sets the minimum timestamp", () => {
    const min = new Date(2023, 0, 1);
    filterStateStore.setMinTimestamp(min);
    expect(filterStateStore.selected_min_timestamp).toEqual(min);
  });

  it("sets the maximum timestamp", () => {
    const max = new Date(2023, 0, 15);
    filterStateStore.setMaxTimestamp(max);
    expect(filterStateStore.selected_max_timestamp).toEqual(max);
  });
});
