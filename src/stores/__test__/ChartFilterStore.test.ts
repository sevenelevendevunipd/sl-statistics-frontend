import { ChartFilterStore } from '../ChartFilterStore';
import { ChartsService } from "../../openapi";
enum ChartFilterStoreState {
    idle,
    waiting,
    error,
  }
describe('ChartFilterStore', () => {
  let store: ChartFilterStore;

  beforeEach(() => {
    store = new ChartFilterStore();
  });

  it('should start in idle state with empty data', () => {
    expect(store.state).toBe(ChartFilterStoreState.idle);
    expect(store.selectableCodes).toEqual([]);
    expect(store.selectableSubunits).toEqual([]);
    expect(store.selectableFirmwares).toEqual([]);
  });

  it('should update data when calling update()', async () => {
    const data = {
      codes: ['code1', 'code2'],
      subunits: [1, 2, 3],
      firmwares: ['firmware1', 'firmware2'],
    };
    jest.spyOn(global.Date.prototype, 'toISOString').mockReturnValueOnce('2023-04-27T12:00:00.000Z');
    jest.spyOn(global.Date.prototype, 'toISOString').mockReturnValueOnce('2023-04-28T12:00:00.000Z');
    jest.spyOn(ChartsService, 'getApiChartsFilters').mockResolvedValueOnce(data);

    await store.update(new Date('2023-04-27'), new Date('2023-04-28'));

    expect(store.state).toBe(ChartFilterStoreState.idle);
    expect(store.selectableCodes).toEqual(data.codes);
    expect(store.selectableSubunits).toEqual(data.subunits);
    expect(store.selectableFirmwares).toEqual(data.firmwares);
  });

  it('should handle error when calling update()', async () => {
    jest.spyOn(global.Date.prototype, 'toISOString').mockReturnValueOnce('2023-04-27T12:00:00.000Z');
    jest.spyOn(global.Date.prototype, 'toISOString').mockReturnValueOnce('2023-04-28T12:00:00.000Z');
    jest.spyOn(ChartsService, 'getApiChartsFilters').mockRejectedValueOnce(new Error('Something went wrong'));

    await store.update(new Date('2023-04-27'), new Date('2023-04-28'));

    expect(store.state).toBe(ChartFilterStoreState.error);
    expect(store.selectableCodes).toEqual([]);
    expect(store.selectableSubunits).toEqual([]);
    expect(store.selectableFirmwares).toEqual([]);
  });
});
