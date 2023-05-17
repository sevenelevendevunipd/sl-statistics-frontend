import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
import { ListBox } from "primereact/listbox";
import { ScrollPanel } from "primereact/scrollpanel";
import { Tree, TreeCheckboxSelectionKeys } from "primereact/tree";

import ErrorDialog from "../../components/ErrorDialog";
import StackedBarChart from "../../components/StackedBarChart";
import IChartFilterStore from "../../stores/ChartFilterStore";
import { useRootStore } from "../../stores/RootStore";
import ITimeChartDataStore from "../../stores/TimeChartDataStore";
import { groupBy, hashUnitSubUnit, splitUnitSubUnitHash } from "../../utils";

type ChartStore = {
  timeChartDataStore: ITimeChartDataStore;
  chartFilterStore: IChartFilterStore;
};

const TimeChartObserver = observer(({ timeChartDataStore }: ChartStore) => (
  <StackedBarChart xKey="timestamp" dataset={timeChartDataStore.data} />
));

const SubunitTreeObserver = observer(
  ({ timeChartDataStore, chartFilterStore }: ChartStore) => {
    const groupedUnitSubunits = groupBy(
      chartFilterStore.selectableSubunits.map(splitUnitSubUnitHash),
      (e) => e[0]
    );
    const unitSubUnits = Object.keys(groupedUnitSubunits).map((unit) => ({
      key: unit.toString(),
      label: `Unit ${unit}`,
      children: groupedUnitSubunits[parseInt(unit)].map((subUnit) => ({
        key: `s${hashUnitSubUnit(parseInt(unit), subUnit[1])}`,
        label: `Unit ${unit} SubUnit ${subUnit[1]}`,
      })),
    }));
    return (
      <Tree
        selectionMode="checkbox"
        value={unitSubUnits}
        selectionKeys={timeChartDataStore.selectedSubUnits}
        onSelectionChange={(ev) =>
          runInAction(() => {
            timeChartDataStore.selectedSubUnits =
              ev.value as TreeCheckboxSelectionKeys;
          })
        }
      />
    );
  }
);
const CodeSelectionObserver = observer(
  ({ timeChartDataStore, chartFilterStore }: ChartStore) => {
    return (
      <ListBox
        options={chartFilterStore.selectableCodes}
        multiple
        filter
        value={timeChartDataStore.selectedCodes}
        optionDisabled={(opt) =>
          timeChartDataStore.selectedCodes.length >= 7 &&
          !timeChartDataStore.selectedCodes.includes(opt)
        }
        onChange={(e) =>
          runInAction(() => (timeChartDataStore.selectedCodes = e.value))
        }
        listStyle={{ height: "16rem" }}
      />
    );
  }
);

const ErrorDialogObserver = observer(
  ({ timeChartDataStore, chartFilterStore }: ChartStore) => (
    <ErrorDialog
      shouldBeVisible={() =>
        timeChartDataStore.hasError || chartFilterStore.hasError
      }
      canBeRetried={false}
      error={() => timeChartDataStore.error || chartFilterStore.error}
    />
  )
);

const TimeChartView = () => {
  const rootStore = useRootStore();
  return (
    <div className="grid">
      <ErrorDialogObserver {...rootStore} />
      <div className="col-6">
        <Card title="Filter by subUnit" className="m-2">
          <ScrollPanel style={{ height: "21rem" }}>
            <SubunitTreeObserver {...rootStore} />
          </ScrollPanel>
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

export default TimeChartView;
