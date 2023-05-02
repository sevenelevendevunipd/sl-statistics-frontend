import { LogFrequencyStore, LogFrequencyStoreState } from '../LogFrequencyStore';
import { ApiError, LogAggregationAnalysisService } from '../../openapi';
import { MAX_DATE, MIN_DATE } from '../../utils';

describe("LogFrequencyStore", () => {
  let store: LogFrequencyStore;

  beforeEach(() => {
    store = new LogFrequencyStore();
  });

  it("should initialize with the correct default values", () => {
    expect(store.state).toBe(LogFrequencyStoreState.idle);
    expect(store.error).toBeUndefined();
    expect(store.entryFrequencies).toEqual([]);
    expect(store.selectedMinTimestamp).toEqual(new Date(MIN_DATE));
    expect(store.selectedMaxTimestamp).toEqual(new Date(MAX_DATE));
    expect(store.selectedSubunits).toEqual(store.selectedSubunits);
  });

  it("should update the selected timestamp range correctly", () => {
    const min = new Date(2021, 0, 1);
    const max = new Date(2021, 0, 31);

    store.setSelectedRange(min, max);

    expect(store.selectedMinTimestamp).toEqual(min);
    expect(store.selectedMaxTimestamp).toEqual(max);
  });

  it("should update the selected minimum timestamp correctly", () => {
    const min = new Date(2021, 0, 1);

    store.setMinTimestamp(min);

    expect(store.selectedMinTimestamp).toEqual(min);
  });

  it("should update the selected maximum timestamp correctly", () => {
    const max = new Date(2021, 0, 31);

    store.setMaxTimestamp(max);

    expect(store.selectedMaxTimestamp).toEqual(max);
  });

  it("should update the selected subunit checkboxes correctly", () => {
    const selectedSubunits = { s1: { checked: true } };

    store.setSubunitSelection(selectedSubunits);

    expect(store.selectedSubunits).toEqual(selectedSubunits);
  });

  it("should update the entry frequencies correctly", async () => {
    const entry = [{
              firmware: "1.2.3",
              event_code: "S009",
              count: 5
    }]

    jest
      .spyOn(LogAggregationAnalysisService, "postApiFrequency")
       .mockResolvedValue({ entries: entry });

    await store.updateFrequencies();

    expect(store.entryFrequencies).toEqual(entry);
  });

  it("should handle errors when updating the entry frequencies", async () => {
    jest
      .spyOn(LogAggregationAnalysisService, "postApiFrequency")
       .mockRejectedValue(new ApiError(
              { method: "PUT",
                url: "" }, 
              { url: "",
                ok: false,
                status: 400,
                statusText: "Bad Request",
                body: {
                    errors: [
                        "sampleerrortext"
                    ]
                }
              }, 
              "")
          );

    await store.updateFrequencies();

    expect(store.hasError).toBe(true);
  });

//   it("should compute the correct list of firmwares", () => {
//     store.entryFrequencies = [      { firmware: "1.2.3", entries: [] },
//       { firmware: "1.2.4", entries: [] },
//       { firmware: "1.2.3", entries: [] },
//     ];
//     const expected = ["1.2.3", "1.2.4"];

//     expect(store.firmwares).toEqual(expected);
//   });

//   
});
