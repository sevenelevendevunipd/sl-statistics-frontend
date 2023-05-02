import { SelectedLogsInfoStore, SelectedLogsInfoStoreState } from '../SelectedLogsInfoStore';
import { LogAggregationAnalysisService } from '../../openapi';

describe('SelectedLogsInfoStore', () => {
  let store: SelectedLogsInfoStore;
  const getApiOverviewSpy = jest.spyOn(LogAggregationAnalysisService, 'getApiOverview');

  beforeEach(() => {
    store = new SelectedLogsInfoStore();
  });

  describe('updateOverview', () => {
    it('updates successfully', async () => {

      const mockValue = {
        total_entries: 420,
        avg_entries: 317,
        max_count_entry: {
                filename: "file1",
                entry_count: 12
        },
        entries_std_dev: 6
      }
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

    it('handles errors', async () => {
      const mockError = new Error('An error occurred');
      getApiOverviewSpy.mockRejectedValue(mockError);

      expect(store.state).toEqual(SelectedLogsInfoStoreState.idle);
      expect(store.hasError).toEqual(false);
      expect(store.error).toBeUndefined();
      expect(store.info).toBeUndefined();

      await store.updateOverview(new Date(), new Date());

      expect(store.state).toEqual(SelectedLogsInfoStoreState.error);
      expect(store.hasError).toEqual(true);
      expect(store.error).toEqual(undefined);
      expect(store.info).toBeUndefined();
    });
  });
});
