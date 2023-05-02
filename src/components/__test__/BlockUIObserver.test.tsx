import { render } from "@testing-library/react";
import BlockUIObserver from "../BlockUIObserver";

describe("BlockUIObserver", () => {
  it("renders the progress spinner when shouldBlock is true", () => {
    const { getByRole } = render(
      <BlockUIObserver shouldBlock={() => true}>
        <div>Child Component</div>
      </BlockUIObserver>
    );

    //the progress spinner has role alert
    expect(getByRole("alert")).toBeInTheDocument();
  });

  it("renders the children when shouldBlock is false", () => {
    const { getByText } = render(
      <BlockUIObserver shouldBlock={() => false}>
        <div>Child Component</div>
      </BlockUIObserver>
    );

    expect(getByText("Child Component")).toBeInTheDocument();
  });
});
