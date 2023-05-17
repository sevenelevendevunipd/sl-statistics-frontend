import { reaction } from "mobx";
import { ChartsService, ApiError } from "../../openapi";
import { TimeChartDataStore, TimeChartStoreState } from "../TimeChartDataStore";

describe("TimeChartDataStore", () => {
  let timeChartDataStore: TimeChartDataStore;
  const chartsServiceSpy = jest.spyOn(ChartsService, "postApiChartsTime");

  beforeEach(() => {
    jest.resetAllMocks();
    timeChartDataStore = new TimeChartDataStore();
  });

  it("update", (done) => {
    const data = {
      bars: [
        { id: "1", name: "Bar 1", value: "10" },
        { id: "2", name: "Bar 2", value: "20" },
        { id: "3", name: "Bar 3", value: "30" },
      ],
    };

    chartsServiceSpy.mockResolvedValue(data);

    reaction(
      () => timeChartDataStore.state,
      (state) => {
        if (state == TimeChartStoreState.idle) {
          expect(chartsServiceSpy).toBeCalled();
          expect(timeChartDataStore.data.length).toBeGreaterThan(0);
          done();
        }
      }
    );

    timeChartDataStore.update(new Date(), new Date(), [1, 2, 3]);
  });

  it("update - errror", async () => {
    /*reaction(
      () => timeChartDataStore.state,
      (state) => {
        if (state == TimeChartStoreState.error) {
          done();
        }
      }
    );
    const error = new ApiError(
      {
        method: "POST",
        url: "",
      },
      {
        url: "",
        ok: false,
        status: 422,
        statusText: "Bad Request",
        body: [],
      },
      ""
    );*/

    const errorText = "sampleerrortext";
    const apiError1 = new ApiError(
      {
        method: "PUT",
        url: "",
      },
      {
        url: "",
        ok: false,
        status: 400,
        statusText: "Bad Request",
        body: {
          errors: [errorText],
        },
      },
      ""
    );
    const apiError2 = new ApiError(
      {
        method: "PUT",
        url: "",
      },
      {
        url: "",
        ok: false,
        status: 400,
        statusText: "Bad Request",
        body: {
          errors: errorText,
        },
      },
      ""
    );
    const typeError = new TypeError("Type error occurred");
    const error = new Error("error message");

    chartsServiceSpy.mockRejectedValueOnce(apiError1);
    await timeChartDataStore.update(new Date(), new Date(), [1, 2, 3]);

    expect(timeChartDataStore.hasError).toBe(true);
    expect(timeChartDataStore.error).toEqual(
      "Error while getting log file list: sampleerrortext"
    );

    chartsServiceSpy.mockRejectedValueOnce(apiError2);
    await timeChartDataStore.update(new Date(), new Date(), [1, 2, 3]);

    expect(timeChartDataStore.hasError).toBe(true);
    expect(timeChartDataStore.error).toEqual(
      'Error while getting log file list: {"errors":"sampleerrortext"}'
    );

    chartsServiceSpy.mockRejectedValueOnce(typeError);
    await timeChartDataStore.update(new Date(), new Date(), [1, 2, 3]);

    expect(timeChartDataStore.hasError).toBe(true);
    expect(timeChartDataStore.error).toEqual(
      "Error while getting log file list: Type error occurred"
    );

    chartsServiceSpy.mockRejectedValueOnce(error);
    await timeChartDataStore.update(new Date(), new Date(), [1, 2, 3]);

    expect(timeChartDataStore.hasError).toBe(true);
    expect(timeChartDataStore.error).toEqual(
      "Error while getting log file list: Error: error message"
    );
  });
});
