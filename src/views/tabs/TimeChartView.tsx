import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
import { ListBox } from "primereact/listbox";
import { ScrollPanel } from "primereact/scrollpanel";
import { Tree } from "primereact/tree";

import ErrorDialog from "../../components/ErrorDialog";
import StackedBarChart from "../../components/StackedBarChart";
import { MaybeViewModelProps, ViewModelProps } from "../../utils";
import {
  ITimeChartViewModel,
  TimeChartViewModel,
} from "../../viewmodels/tabs/TimeChartViewModel";

const TimeChartObserver = observer(
  ({ viewModel }: ViewModelProps<ITimeChartViewModel>) => (
    <StackedBarChart xKey="timestamp" dataset={viewModel.chartData()} />
  )
);

const SubunitTreeObserver = observer(
  ({ viewModel }: ViewModelProps<ITimeChartViewModel>) => {
    return (
      <Tree
        selectionMode="checkbox"
        value={viewModel.selectableSubunits()}
        selectionKeys={viewModel.selectedSubunits()}
        onSelectionChange={viewModel.onSubunitSelectionChange}
      />
    );
  }
);
const CodeSelectionObserver = observer(
  ({ viewModel }: ViewModelProps<ITimeChartViewModel>) => {
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

const TimeChartView = (props: MaybeViewModelProps<ITimeChartViewModel>) => {
  const viewModel = props.viewModel ?? TimeChartViewModel();
  return (
    <div className="grid">
      <ErrorDialog
        shouldBeVisible={viewModel.hasError}
        canBeRetried={false}
        error={viewModel.error}
      />
      <div className="col-6">
        <Card title="Filter by subUnit" className="m-2">
          <ScrollPanel style={{ height: "21rem" }}>
            <SubunitTreeObserver viewModel={viewModel} />
          </ScrollPanel>
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

export default TimeChartView;
