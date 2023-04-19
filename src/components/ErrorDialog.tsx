import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const ErrorDialog = observer(
  ({
    shouldBeVisible,
    error,
    canBeRetried = false,
    onClose = noop,
  }: {
    shouldBeVisible: () => boolean;
    error: () => string | undefined;
    canBeRetried?: (() => boolean) | boolean;
    onClose?: () => void;
  }) => {
    const retryable =
      typeof canBeRetried == "function" ? canBeRetried() : canBeRetried;
    return (
      <Dialog
        header="Error"
        position="top"
        onHide={noop}
        draggable={false}
        resizable={false}
        closable={false}
        closeOnEscape={false}
        visible={shouldBeVisible()}
        footer={
          <Button
            label={retryable ? "Retry" : "Close"}
            icon={`pi pi-${retryable ? "refresh" : "times"}`}
            onClick={onClose}
            autoFocus
          />
        }
      >
        <p className="m-0">{error()}</p>
      </Dialog>
    );
  }
);

export default ErrorDialog;
