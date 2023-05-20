import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { ScrollPanel } from "primereact/scrollpanel";
import { Tree } from "primereact/tree";

import ErrorDialog from "../../components/ErrorDialog";
import RangePicker from "../../components/RangePicker";
import {
  ILogFrequencyViewModel,
  LogFrequencyViewModel,
} from "../../viewmodels/tabs/LogFrequencyViewModel";
import { MaybeViewModelProps, ViewModelProps } from "../../utils";

const TableObserver = observer(
  ({ viewModel }: ViewModelProps<ILogFrequencyViewModel>) => {
    const FirmwareFilter = (options: ColumnFilterElementTemplateOptions) => (
      <MultiSelect
        value={options.value}
        options={viewModel.selectableFirmwares()}
        onChange={(e) => options.filterApplyCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
        maxSelectedLabels={1}
        itemTemplate={(i) => i}
        selectedItemTemplate={(i) => i}
      />
    );

    return (
      <DataTable
        value={viewModel.entryFrequencies()}
        removableSort
        sortField="count"
        sortOrder={-1}
        size="small"
        responsiveLayout="scroll"
        paginator
        filterDisplay="row"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        rows={15}
      >
        <Column
          header="Firmware Version"
          filterField="firmware"
          showFilterMenu={false}
          filter
          filterElement={FirmwareFilter}
          filterMatchMode="in"
          field="firmware"
          style={{ width: "30em" }}
        />
        <Column header="Event Code" field="event_code" sortable />
        <Column header="Event Count" field="count" sortable />
      </DataTable>
    );
  }
);

const SubunitTreeObserver = observer(
  ({ viewModel }: ViewModelProps<ILogFrequencyViewModel>) => {
    return (
      <Tree
        selectionMode="checkbox"
        value={viewModel.selectableSubunits}
        selectionKeys={viewModel.selectedSubunits()}
        onSelectionChange={viewModel.onSubunitSelectionChange}
      />
    );
  }
);

const LogFrequencyView = (
  props: MaybeViewModelProps<ILogFrequencyViewModel>
) => {
  const viewModel = props.viewModel ?? LogFrequencyViewModel();
  return (
    <>
      <div className="grid">
        <ErrorDialog
          shouldBeVisible={viewModel.hasError}
          canBeRetried={false}
          error={viewModel.error}
        />
        <div className="col-9 flex">
          <Card className="m-2 flex-grow-1" title="Entries frequency">
            <TableObserver viewModel={viewModel} />
          </Card>
        </div>
        <div className="col-3 flex flex-column">
          <Card title="Filter by Unit/SubUnit" className="m-2">
            <ScrollPanel style={{ height: "20rem" }}>
              <SubunitTreeObserver viewModel={viewModel} />
            </ScrollPanel>
          </Card>
          <RangePicker
            title="Filter by Datetime"
            minAllowed={viewModel.minAllowedTimestamp}
            maxAllowed={viewModel.maxAllowedTimestamp}
            minValue={viewModel.minSelectedTimestamp}
            maxValue={viewModel.maxSelectedTimestamp}
            onMinChange={viewModel.onMinSelectionChange}
            onMaxChange={viewModel.onMaxSelectionChange}
            className="flex-grow-1"
          />
        </div>
      </div>
    </>
  );
};

export default LogFrequencyView;
