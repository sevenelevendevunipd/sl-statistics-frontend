import { FirmwareChartDataStore } from "../FirmwareChartDataStore";
// import FirmwareChartStoreState from '../FirmwareChartDataStore';
import IFirmwareChartDataStore from "../FirmwareChartDataStore";
import { ApiError, ChartsService } from "../../openapi";

enum FirmwareChartStoreState {
  idle,
  waiting,
  error,
}
describe("FirmwareChartDataStore", () => {
  let firmwareChartDataStore: IFirmwareChartDataStore;

  beforeEach(() => {
    jest.resetAllMocks();
    firmwareChartDataStore = new FirmwareChartDataStore();
  });

  describe("update", () => {
    const postApiChartsFirmwareSpy = jest.spyOn(
      ChartsService,
      "postApiChartsFirmware"
    );

    it("updates successfully with all firmwares", (done) => {
      const mockData = {
        bars: [
          { firmware: "v1", count: "10" },
          { firmware: "v2", count: "20" },
        ],
      };
      postApiChartsFirmwareSpy.mockResolvedValue(mockData);
      firmwareChartDataStore.update(new Date(), new Date(), ["v1", "v2"]);

      expect(firmwareChartDataStore.state).toEqual(
        FirmwareChartStoreState.waiting
      );
      expect(firmwareChartDataStore.error).toBeUndefined();

      setTimeout(() => {
        expect(postApiChartsFirmwareSpy).toBeCalled();
        expect(firmwareChartDataStore.data).toEqual(mockData.bars);
        expect(firmwareChartDataStore.state).toEqual(
          FirmwareChartStoreState.idle
        );
        done();
      }, 0);
    });

    it("updates successfully with selected firmwares", (done) => {
      const mockData = { bars: [{ firmware: "v2", count: "20" }] };
      firmwareChartDataStore.selectedFirmwares = ["v2"];
      postApiChartsFirmwareSpy.mockResolvedValue(mockData);
      firmwareChartDataStore.update(new Date(), new Date(), ["v1", "v2"]);

      expect(firmwareChartDataStore.state).toEqual(
        FirmwareChartStoreState.waiting
      );
      expect(firmwareChartDataStore.error).toBeUndefined();

      setTimeout(() => {
        expect(postApiChartsFirmwareSpy).toBeCalledWith(
          expect.objectContaining({
            selected_firmwares: ["v2"],
          })
        );
        expect(firmwareChartDataStore.data).toEqual(mockData.bars);
        expect(firmwareChartDataStore.state).toEqual(
          FirmwareChartStoreState.idle
        );
        done();
      }, 0);
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
      
      postApiChartsFirmwareSpy.mockRejectedValueOnce(apiError1);
      await firmwareChartDataStore.update(new Date(), new Date(), ["v1", "v2"]);

      expect(postApiChartsFirmwareSpy).toBeCalled();
      expect(firmwareChartDataStore.state).toEqual(FirmwareChartStoreState.error);
      expect(firmwareChartDataStore.error).toEqual("Error while getting log file list: sampleerrortext");

      postApiChartsFirmwareSpy.mockRejectedValueOnce(apiError2);
      await firmwareChartDataStore.update(new Date(), new Date(), ["v1", "v2"]);

      expect(postApiChartsFirmwareSpy).toBeCalled();
      expect(firmwareChartDataStore.state).toEqual(FirmwareChartStoreState.error);
      expect(firmwareChartDataStore.error).toEqual("Error while getting log file list: {\"errors\":\"sampleerrortext\"}");

      postApiChartsFirmwareSpy.mockRejectedValueOnce(typeError);
      await firmwareChartDataStore.update(new Date(), new Date(), ["v1", "v2"]);

      expect(postApiChartsFirmwareSpy).toBeCalled();
      expect(firmwareChartDataStore.state).toEqual(FirmwareChartStoreState.error);
      expect(firmwareChartDataStore.error).toEqual("Error while getting log file list: Type error occurred");

      postApiChartsFirmwareSpy.mockRejectedValueOnce(error);
      await firmwareChartDataStore.update(new Date(), new Date(), ["v1", "v2"]);

      expect(postApiChartsFirmwareSpy).toBeCalled();
      expect(firmwareChartDataStore.state).toEqual(FirmwareChartStoreState.error);
      expect(firmwareChartDataStore.error).toEqual("Error while getting log file list: Error: error message");
    });
  });
});
