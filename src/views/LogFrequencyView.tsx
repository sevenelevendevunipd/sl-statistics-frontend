import { observer } from "mobx-react-lite";
import { useRootStore } from "../stores/RootStore";
import { DataTable } from "primereact/datatable";
import { ScrollPanel } from "primereact/scrollpanel";
import { MultiSelect } from "primereact/multiselect";
import { Tree, TreeCheckboxSelectionKeys } from "primereact/tree";
import ILogFrequencyStore, {
  allUnitSubunits,
} from "../stores/LogFrequencyStore";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { Card } from "primereact/card";
import RangePicker from "../components/RangePicker";

const TableObserver = observer(
  ({ logFrequencyStore }: { logFrequencyStore: ILogFrequencyStore }) => {
    const filterOpts = logFrequencyStore.firmwares;
    const FirmwareFilter = (options: ColumnFilterElementTemplateOptions) => (
      <MultiSelect
        value={options.value}
        options={filterOpts}
        onChange={(e) => options.filterApplyCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
        maxSelectedLabels={1}
        itemTemplate={(i) => i}
        selectedItemTemplate={(i) => i}
        //style={{ minWidth: "14rem" }}
      />
    );

    return (
      <DataTable
        value={logFrequencyStore.entry_frequencies}
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
  ({ logFrequencyStore }: { logFrequencyStore: ILogFrequencyStore }) => {
    return (
      <Tree
        selectionMode="checkbox"
        value={allUnitSubunits}
        selectionKeys={logFrequencyStore.selected_subunits}
        onSelectionChange={(ev) =>
          logFrequencyStore.setSubunitSelection(
            ev.value as TreeCheckboxSelectionKeys
          )
        }
      />
    );
  }
);

const LogFrequencyView = () => {
  const rootStore = useRootStore();
  const { filterStateStore, logFrequencyStore } = rootStore;
  return (
    <>
      <div className="grid">
        <div className="col-9 flex">
          <Card className="m-2 flex-grow-1" title="Entries frequency">
            <TableObserver {...rootStore} />
          </Card>
        </div>
        <div className="col-3 flex flex-column">
          <Card title="Filter by Unit/SubUnit" className="m-2">
            <ScrollPanel style={{ height: "20rem" }}>
              <SubunitTreeObserver {...rootStore} />
            </ScrollPanel>
          </Card>
          <RangePicker
            title="Filter by Datetime"
            minAllowed={() => filterStateStore.selected_min_timestamp}
            maxAllowed={() => filterStateStore.selected_max_timestamp}
            minValue={() => logFrequencyStore.selected_min_timestamp}
            maxValue={() => logFrequencyStore.selected_max_timestamp}
            onMinChange={logFrequencyStore.setMinTimestamp}
            onMaxChange={logFrequencyStore.setMaxTimestamp}
            className="flex-grow-1"
          />
        </div>
      </div>
    </>
  );
};

export default LogFrequencyView;
