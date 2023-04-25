import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { FileUpload } from "primereact/fileupload";
import { Message } from "primereact/message";
import { Skeleton } from "primereact/skeleton";

import BlockUIObserver from "../../components/BlockUIObserver";
import ErrorDialog from "../../components/ErrorDialog";
import InfoRow from "../../components/InfoRow";
import RangePicker from "../../components/RangePicker";
import { StoredLogList_c682361_StoredLogFile } from "../../openapi";
import IFilterStateStore from "../../stores/FilterStateStore";
import ILogListStore, { LogListStoreState } from "../../stores/LogListStore";
import { useRootStore } from "../../stores/RootStore";
import ISelectedLogsInfoStore, {
  SelectedLogsInfoStoreState,
} from "../../stores/SelectedLogsInfoStore";

type ObserverProps = {
  logListStore: ILogListStore;
  filterStateStore: IFilterStateStore;
  selectedLogsInfoStore: ISelectedLogsInfoStore;
};

const LogListObserver = observer(({ logListStore }: ObserverProps) => (
  <BlockUIObserver
    shouldBlock={() => logListStore.state != LogListStoreState.idle}
  >
    <ErrorDialog
      shouldBeVisible={() => logListStore.hasError}
      canBeRetried={() => logListStore.errorCanRetry}
      onClose={logListStore.updateLogList}
      error={() => logListStore.error}
    />
    <Card className="m-2" title="Uploaded Logs">
      <DataTable
        value={logListStore.logs}
        removableSort
        sortField="file_name"
        size="small"
        responsiveLayout="scroll"
        paginator
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        rows={10}
      >
        <Column header="File Name" field="file_name" sortable />
        <Column header="First entry" field="first_entry_timestamp" sortable />
        <Column header="Last entry" field="last_entry_timestamp" sortable />
        <Column header="Entry count" field="entry_count" sortable />
        <Column
          header="Delete file"
          body={(entry: StoredLogList_c682361_StoredLogFile) => (
            <Button
              severity="danger"
              icon="pi pi-trash"
              onClick={() =>
                confirmDialog({
                  icon: "pi pi-exclamation-triangle",
                  header: "Delete Confirmation",
                  message: (
                    <span>
                      Are you sure you want to permanently delete log file
                      <pre>{entry.file_name}</pre> from the database?
                    </span>
                  ),
                  acceptClassName: "p-button-danger",
                  accept: () => logListStore.deleteLogFile(entry.file_name),
                })
              }
            />
          )}
        />
      </DataTable>
    </Card>
  </BlockUIObserver>
));

const LogOverviewData = ({ selectedLogsInfoStore }: ObserverProps) => {
  const info = () => selectedLogsInfoStore.info; // A function call is used to prevent a MobX warning.
  return (
    <>
      <ErrorDialog
        shouldBeVisible={() => selectedLogsInfoStore.hasError}
        canBeRetried={false}
        error={() => selectedLogsInfoStore.error}
      />
      <InfoRow caption="Total entries" value={() => info()?.total_entries} />
      <InfoRow caption="Average entries" value={() => info()?.avg_entries} />
      <InfoRow
        caption="Entry count standard deviation"
        value={() => info()?.entries_std_dev}
      />
      <InfoRow
        caption="Max count"
        value={() => {
          const i = info();
          return (
            <>
              {i?.max_count_entry.entry_count ?? (
                <Skeleton width="3em" className="inline-block" />
              )}
              <br />(
              {i !== undefined ? (
                <span className="text-sm">{i.max_count_entry.filename}</span>
              ) : (
                <Skeleton width="10em" className="inline-block" />
              )}
              )
            </>
          );
        }}
      />
    </>
  );
};

const LogListView = () => {
  const rootStore = useRootStore();
  const { logListStore, filterStateStore } = rootStore;
  return (
    <>
      <ConfirmDialog />
      <div className="flex flex-row m-4 justify-content-around">
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          onClick={logListStore.updateLogList}
          severity="help"
        />
        <FileUpload
          name="log"
          accept="text/csv"
          customUpload
          uploadHandler={(ev) => {
            logListStore.uploadLogFile(ev.files[0]);
            ev.options.clear();
          }}
          mode="basic"
          auto
          chooseLabel="Upload a Log"
          chooseOptions={{
            icon: "pi pi-upload",
            className: "p-button-info",
          }}
        />
      </div>
      <div className="grid">
        <div className="col-9">
          <LogListObserver {...rootStore} />
        </div>
        <BlockUIObserver
          shouldBlock={() => !logListStore.hasLogs}
          props={{
            containerClassName: "col-3 flex flex-column",
            template: (
              <Message text="No log files available!" severity="error" />
            ),
            style: { backdropFilter: "blur(7px)" },
          }}
        >
          <RangePicker
            title="Filter by Datetime"
            minAllowed={() => logListStore.minTimestamp}
            maxAllowed={() => logListStore.maxTimestamp}
            minValue={() => filterStateStore.selected_min_timestamp}
            maxValue={() => filterStateStore.selected_max_timestamp}
            onMinChange={filterStateStore.setMinTimestamp}
            onMaxChange={filterStateStore.setMaxTimestamp}
          />

          <BlockUIObserver
            shouldBlock={() =>
              rootStore.selectedLogsInfoStore.state ==
              SelectedLogsInfoStoreState.loading
            }
            props={{ containerClassName: "flex-grow-1 flex flex-column" }}
          >
            <Card title="Log Overview" className="m-2 flex-grow-1">
              <LogOverviewData {...rootStore} />
            </Card>
          </BlockUIObserver>
        </BlockUIObserver>
      </div>
    </>
  );
};

export default LogListView;
