import { render, waitFor } from "@testing-library/react";
import InfoRow from "../InfoRow";

describe("InfoRow", () => {
  it("renders a Skeleton if the value is undefined", async () => {
    const caption = "Example Caption";
    const value = () => undefined;
    const { getByTestId } = render(<InfoRow caption={caption} value={value} />);
    await waitFor(() => {
      expect(getByTestId("skeleton")).toBeInTheDocument();
    });
  });
});
