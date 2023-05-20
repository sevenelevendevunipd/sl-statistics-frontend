import { render, screen } from "@testing-library/react";
import LogFrequencyView from "../LogFrequencyView";

const viewModelFactory = () => ({
  hasError: jest.fn(),
  error: jest.fn(),

  minAllowedTimestamp: jest.fn(),
  maxAllowedTimestamp: jest.fn(),
  minSelectedTimestamp: jest.fn(),
  maxSelectedTimestamp: jest.fn(),
  onMinSelectionChange: jest.fn(),
  onMaxSelectionChange: jest.fn(),

  selectableSubunits: [],
  selectedSubunits: jest.fn(),
  onSubunitSelectionChange: jest.fn(),

  selectableFirmwares: jest.fn(),

  entryFrequencies: jest.fn(),
});

describe("LogFrequencyView", () => {
  it("LogFrequencyView", () => {
    const viewModel = viewModelFactory();
    render(<LogFrequencyView viewModel={viewModel} />);
    expect(screen.getByText(/Entries frequency/i)).toBeInTheDocument();
    expect(screen.getByText(/Filter by Unit\/SubUnit/i)).toBeInTheDocument();
    expect(screen.getByText(/Filter by Datetime/i)).toBeInTheDocument();
  });
});
