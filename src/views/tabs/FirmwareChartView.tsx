import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
import { ListBox } from "primereact/listbox";

import ErrorDialog from "../../components/ErrorDialog";
import StackedBarChart from "../../components/StackedBarChart";
import { MaybeViewModelProps, ViewModelProps } from "../../utils";
import { IFirmwareChartViewModel, FirmwareChartViewModel } from "../../viewmodels/tabs/FirmwareChartViewModel";

const TimeChartObserver = observer(({ viewModel }: ViewModelProps<IFirmwareChartViewModel>) => (
  <StackedBarChart
    xKey="firmware"
    dataset={viewModel.chartData()}
    isXLabelRotated
    style={{ height: "40rem" }}
  />
));

const CodeSelectionObserver = observer(
  ({ viewModel }: ViewModelProps<IFirmwareChartViewModel>) => {
    return (
      <ListBox
        options={viewModel.selectableCodes()}
        multiple
        filter
        value={viewModel.selectedCodes()}
        optionDisabled={viewModel.disableCodeOption}
        onChange={viewModel.onCodeSelectionChange}
        listStyle={{ height: "16rem" }}
      />
    );
  }
);

const FirmwareSelectionObserver = observer(
  ({ viewModel }: ViewModelProps<IFirmwareChartViewModel>) => {
    return (
      <ListBox
        options={viewModel.selectableFirmwares()}
        multiple
        filter
        value={viewModel.selectedFirmwares()}
        onChange={viewModel.onFirmwareSelectionChange}
        listStyle={{ height: "16rem" }}
      />
    );
  }
);

const ErrorDialogObserver = observer(
  ({ viewModel }: ViewModelProps<IFirmwareChartViewModel>) => (
    <ErrorDialog
      shouldBeVisible={viewModel.hasError}
      canBeRetried={false}
      error={viewModel.error}
    />
  )
);

const FirmwareChartView = (props: MaybeViewModelProps<IFirmwareChartViewModel>) => {
  const viewModel = props.viewModel ?? FirmwareChartViewModel();
  return (
    <div className="grid">
      <ErrorDialogObserver viewModel={viewModel} />
      <div className="col-6">
        <Card title="Filter by Firmware" className="m-2">
          <FirmwareSelectionObserver viewModel={viewModel} />
        </Card>
      </div>
      <div className="col-6 flex">
        <Card title="Filter by Code (max 7)" className="m-2 flex-grow-1">
          <CodeSelectionObserver viewModel={viewModel} />
        </Card>
      </div>
      <div className="col-12">
        <Card title="Chart" className="m-2">
          <TimeChartObserver viewModel={viewModel} />
        </Card>
      </div>
    </div>
  );
};

export default FirmwareChartView;
