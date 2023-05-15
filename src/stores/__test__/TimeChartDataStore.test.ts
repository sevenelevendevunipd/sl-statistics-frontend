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

  it("update - errror", (done) => {
    reaction(
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
    );

    chartsServiceSpy.mockRejectedValueOnce(error);
    timeChartDataStore.update(new Date(), new Date(), [1, 2, 3]);
  });
});
