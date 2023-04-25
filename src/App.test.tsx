import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders table header", () => {
  render(<App />);
  const linkElement = screen.getByText(/uploaded log list/i);
  expect(linkElement).toBeInTheDocument();
});
