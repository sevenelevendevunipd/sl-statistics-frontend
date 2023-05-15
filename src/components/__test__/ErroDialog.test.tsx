import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorDialog from "../ErrorDialog";

describe("ErrorDialog", () => {
  const errorMessage = "Something went wrong!";
  const onClose = jest.fn();
  const shouldBeVisible = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the error message and a 'Retry' button when can be retried", () => {
    shouldBeVisible.mockReturnValue(true);
    render(
      <ErrorDialog
        shouldBeVisible={shouldBeVisible}
        error={() => errorMessage}
        canBeRetried= {true}
        onClose={onClose}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it("should render the error message and a 'Close' button when cannot be retried", () => {
    shouldBeVisible.mockReturnValue(true);
    render(
      <ErrorDialog
        shouldBeVisible={shouldBeVisible}
        error={() => errorMessage}
        canBeRetried={false}
        onClose={onClose}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();

    userEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it("should not be visible when shouldBeVisible returns false", () => {
    shouldBeVisible.mockReturnValue(false);
    render(
      <ErrorDialog
        shouldBeVisible={shouldBeVisible}
        error={() => errorMessage}
        canBeRetried={true}
        onClose={onClose}
      />
    );

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    expect(screen.queryByText("Retry")).not.toBeInTheDocument();
    expect(screen.queryByText("Close")).not.toBeInTheDocument();
  });
});
