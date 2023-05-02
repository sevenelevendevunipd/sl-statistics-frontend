import { ChartFilterStore } from '../ChartFilterStore';
import { ChartsService } from '../../openapi';
enum ChartFilterStoreState {
    idle,
    waiting,
    error,
  }
describe("ChartFilterStore", () => {
  let chartFilterStore: ChartFilterStore;

  beforeEach(() => {
    jest.resetAllMocks();
    chartFilterStore = new ChartFilterStore()
  })

  describe("update", () => {
    const getApiChartsFiltersSpy = jest.spyOn(ChartsService, 'getApiChartsFilters');
    
    it("updates successfully", done => {
      const chartFilterData = {
        codes: ['code1', 'code2'],
        subunits: [1, 2, 3],
        firmwares: ['firmware1', 'firmware2']
      };
      getApiChartsFiltersSpy.mockResolvedValueOnce(chartFilterData);
      
      chartFilterStore.update(new Date(), new Date());

      setTimeout(() => {
        expect(getApiChartsFiltersSpy).toBeCalled();
        expect(chartFilterStore.state).toBe(ChartFilterStoreState.idle);
        expect(chartFilterStore.error).toBeUndefined();
        expect(chartFilterStore.selectableCodes).toEqual(chartFilterData.codes);
        expect(chartFilterStore.selectableSubunits).toEqual(chartFilterData.subunits);
        expect(chartFilterStore.selectableFirmwares).toEqual(chartFilterData.firmwares);
        done();
      }, 0);
    });

    describe("handles errors", () => {
      const errorText = "sampleerrortext";
      
      const testError = (error: any, done: jest.DoneCallback) => {
        getApiChartsFiltersSpy.mockRejectedValueOnce(error);
        
        chartFilterStore.update(new Date(), new Date());
        
        setTimeout(() => {
          expect(getApiChartsFiltersSpy).toBeCalled();
          expect(chartFilterStore.state).toBe(ChartFilterStoreState.error);
          expect(chartFilterStore.error).toBeDefined();
          expect(chartFilterStore.error).toContain(errorText);
          done();
        }, 0);
      }
      
    //   it("handles ApiErrors", done => {
    //     const error = new ApiError({
    //       method: "GET",
    //       url: "",
    //     }, {
    //       url: "",
    //       ok: false,
    //       status: 400,
    //       statusText: "Bad Request",
    //       body: {
    //         errors: [
    //           errorText
    //         ]
    //       }
    //     }, "");
    //     testError(error, done)
    //   });

    //   it("handles TypeErrors", done => {
    //     const error = new TypeError(errorText);
    //     testError(error, done);
    //   });

    //   it("handles other errors", done => {
    //     const error = new Error(errorText);
    //     testError(error, done);
    //   });
    });
  });
});
