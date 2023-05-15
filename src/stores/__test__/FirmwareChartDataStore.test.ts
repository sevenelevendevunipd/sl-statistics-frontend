import { FirmwareChartDataStore } from "../FirmwareChartDataStore";
// import FirmwareChartStoreState from '../FirmwareChartDataStore';
import IFirmwareChartDataStore from "../FirmwareChartDataStore";
import { ChartsService } from "../../openapi";

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

    it("handles errors", (done) => {
      const error = new Error("error message");
      postApiChartsFirmwareSpy.mockRejectedValueOnce(error);

      firmwareChartDataStore.update(new Date(), new Date(), ["v1", "v2"]);

      expect(firmwareChartDataStore.state).toEqual(
        FirmwareChartStoreState.waiting
      );
      //   expect(firmwareChartDataStore.error).toBeUndefined();

      setTimeout(() => {
        expect(postApiChartsFirmwareSpy).toBeCalled();
        expect(firmwareChartDataStore.state).toEqual(
          FirmwareChartStoreState.error
        );
        // expect(firmwareChartDataStore.error).toBeDefined();
        done();
      }, 0);
    });
  });
});
