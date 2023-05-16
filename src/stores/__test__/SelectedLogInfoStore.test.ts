import {
  SelectedLogsInfoStore,
  SelectedLogsInfoStoreState,
} from "../SelectedLogsInfoStore";
import { ApiError, LogAggregationAnalysisService } from "../../openapi";

describe("SelectedLogsInfoStore", () => {
  let store: SelectedLogsInfoStore;
  const getApiOverviewSpy = jest.spyOn(
    LogAggregationAnalysisService,
    "getApiOverview"
  );

  beforeEach(() => {
    store = new SelectedLogsInfoStore();
  });

  describe("updateOverview", () => {
    it("updates successfully", async () => {
      const mockValue = {
        total_entries: 420,
        avg_entries: 317,
        max_count_entry: {
          filename: "file1",
          entry_count: 12,
        },
        entries_std_dev: 6,
      };
      getApiOverviewSpy.mockResolvedValue(mockValue);

      expect(store.state).toEqual(SelectedLogsInfoStoreState.idle);
      expect(store.hasError).toEqual(false);
      expect(store.error).toBeUndefined();
      expect(store.info).toBeUndefined();

      await store.updateOverview(new Date(), new Date());

      expect(store.state).toEqual(SelectedLogsInfoStoreState.idle);
      expect(store.hasError).toEqual(false);
      expect(store.error).toBeUndefined();
      expect(store.info).toEqual(mockValue);
    });

    it("handles errors", async () => {
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

      getApiOverviewSpy.mockRejectedValue(apiError1);
      await store.updateOverview(new Date(), new Date());

      expect(store.hasError).toEqual(true);
      expect(store.error).toEqual("Error while getting log file list: sampleerrortext");

      getApiOverviewSpy.mockRejectedValue(apiError2);
      await store.updateOverview(new Date(), new Date());

      expect(store.hasError).toEqual(true);
      expect(store.error).toEqual("Error while getting log file list: {\"errors\":\"sampleerrortext\"}");

      getApiOverviewSpy.mockRejectedValue(typeError);
      await store.updateOverview(new Date(), new Date());

      expect(store.hasError).toEqual(true);
      expect(store.error).toEqual("Error while getting log file list: Type error occurred");

      getApiOverviewSpy.mockRejectedValue(error);
      await store.updateOverview(new Date(), new Date());

      expect(store.hasError).toEqual(true);
      expect(store.error).toEqual("Error while getting log file list: Error: error message");
    });
  });
});
