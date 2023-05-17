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
import { MaybeViewModelProps, ViewModelProps } from "../../utils";
import {
  ILogListViewModel,
  LogListViewModel,
} from "../../viewmodels/tabs/LogListViewModel";

const LogListObserver = observer(
  ({ viewModel }: ViewModelProps<ILogListViewModel>) => (
    <DataTable
      value={viewModel.logFiles()}
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
                accept: viewModel.deleteFile(entry.file_name),
              })
            }
          />
        )}
      />
    </DataTable>
  )
);

const LogOverviewData = ({ viewModel }: ViewModelProps<ILogListViewModel>) => {
  return (
    <>
      <InfoRow caption="Total entries" value={viewModel.totalEntriesCount} />
      <InfoRow caption="Average entries" value={viewModel.avgEntriesCount} />
      <InfoRow
        caption="Entry count standard deviation"
        value={viewModel.entryStdDev}
      />
      <InfoRow
        caption="Max count"
        value={() => {
          const maxCountEntry = viewModel.maxCountEntryInfo();
          return (
            <>
              {maxCountEntry?.entry_count ?? (
                <Skeleton width="3em" className="inline-block" />
              )}
              <br />(
              {maxCountEntry !== undefined ? (
                <span className="text-sm">{maxCountEntry.filename}</span>
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

const LogListView = (props: MaybeViewModelProps<ILogListViewModel>) => {
  const viewModel = props.viewModel ?? LogListViewModel();
  return (
    <>
      <ConfirmDialog />
      <ErrorDialog
        shouldBeVisible={viewModel.hasError}
        canBeRetried={viewModel.canBeRetried}
        error={viewModel.error}
        onClose={viewModel.onClose}
      />
      <div className="flex flex-row m-4 justify-content-around">
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          onClick={viewModel.onLogListRefreshClick}
          severity="help"
        />
        <FileUpload
          name="log"
          accept="text/csv"
          customUpload
          uploadHandler={viewModel.logUploadHandler}
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
          <BlockUIObserver shouldBlock={viewModel.isListLoading}>
            <Card className="m-2" title="Uploaded Logs">
              <LogListObserver viewModel={viewModel} />
            </Card>
          </BlockUIObserver>
        </div>
        <BlockUIObserver
          shouldBlock={viewModel.isLogListEmpty}
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
            minAllowed={viewModel.minAllowedTimestamp}
            maxAllowed={viewModel.maxAllowedTimestamp}
            minValue={viewModel.minSelectedTimestamp}
            maxValue={viewModel.maxSelectedTimestamp}
            onMinChange={viewModel.onMinSelectionChange}
            onMaxChange={viewModel.onMaxSelectionChange}
          />

          <BlockUIObserver
            shouldBlock={viewModel.isInfoLoading}
            props={{ containerClassName: "flex-grow-1 flex flex-column" }}
          >
            <Card title="Log Overview" className="m-2 flex-grow-1">
              <LogOverviewData viewModel={viewModel} />
            </Card>
          </BlockUIObserver>
        </BlockUIObserver>
      </div>
    </>
  );
};

export default LogListView;
