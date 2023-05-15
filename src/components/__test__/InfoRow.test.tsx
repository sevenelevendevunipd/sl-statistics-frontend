import { render, screen } from "@testing-library/react";
import InfoRow from "../InfoRow";

describe("InfoRow", () => {
  it("renders a Skeleton if the value is undefined", async () => {
    const caption = "Example Caption";
    const value = () => undefined;
    render(<InfoRow caption={caption} value={value} />);
    expect(screen.getByText('Example Caption')).toBeInTheDocument();
  });
});
