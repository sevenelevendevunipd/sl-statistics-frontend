import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
import { ListBox } from "primereact/listbox";

import ErrorDialog from "../../components/ErrorDialog";
import StackedBarChart from "../../components/StackedBarChart";
import IChartFilterStore from "../../stores/ChartFilterStore";
import { useRootStore } from "../../stores/RootStore";
import IFirmwareChartDataStore from "../../stores/FirmwareChartDataStore";

type ChartStore = {
  firmwareChartDataStore: IFirmwareChartDataStore;
  chartFilterStore: IChartFilterStore;
};

const TimeChartObserver = observer(({ firmwareChartDataStore }: ChartStore) => (
  <StackedBarChart
    xKey="firmware"
    dataset={firmwareChartDataStore.data}
    isXLabelRotated
    style={{ height: "40rem" }}
  />
));

const CodeSelectionObserver = observer(
  ({ firmwareChartDataStore, chartFilterStore }: ChartStore) => {
    return (
      <ListBox
        options={chartFilterStore.selectableCodes}
        multiple
        filter
        value={firmwareChartDataStore.selectedCodes}
        optionDisabled={(opt) =>
          firmwareChartDataStore.selectedCodes.length >= 7 &&
          !firmwareChartDataStore.selectedCodes.includes(opt)
        }
        onChange={(e) =>
          runInAction(() => (firmwareChartDataStore.selectedCodes = e.value))
        }
        listStyle={{ height: "16rem" }}
      />
    );
  }
);

const FirmwareSelectionObserver = observer(
  ({ firmwareChartDataStore, chartFilterStore }: ChartStore) => {
    return (
      <ListBox
        options={chartFilterStore.selectableFirmwares}
        multiple
        filter
        value={firmwareChartDataStore.selectedFirmwares}
        onChange={(e) =>
          runInAction(
            () => (firmwareChartDataStore.selectedFirmwares = e.value)
          )
        }
        listStyle={{ height: "16rem" }}
      />
    );
  }
);

const ErrorDialogObserver = observer(
  ({ chartFilterStore }: ChartStore) => (
    <ErrorDialog 
      shouldBeVisible={() => chartFilterStore.hasError}
      canBeRetried={false}
      error={() => chartFilterStore.error}
    />)
)

const FirmwareChartView = () => {
  const rootStore = useRootStore();
  return (
    <div className="grid">
      <ErrorDialogObserver {...rootStore} />
      <div className="col-6">
        <Card title="Filter by Firmware" className="m-2">
          <FirmwareSelectionObserver {...rootStore} />
        </Card>
      </div>
      <div className="col-6 flex">
        <Card title="Filter by Code (max 7)" className="m-2 flex-grow-1">
          <CodeSelectionObserver {...rootStore} />
        </Card>
      </div>
      <div className="col-12">
        <Card title="Chart" className="m-2">
          <TimeChartObserver {...rootStore} />
        </Card>
      </div>
    </div>
  );
};

export default FirmwareChartView;
