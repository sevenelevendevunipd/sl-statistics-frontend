import { render, screen } from "@testing-library/react";
import TimeChartView from "../TimeChartView";

const viewModelFactory = () => ({
  chartData: jest.fn(),
  selectableCodes: jest.fn(),
  selectedCodes: jest.fn(),
  disableCodeOption: jest.fn(),
  onCodeSelectionChange: jest.fn(),

  selectableSubunits: jest.fn(),
  selectedSubunits: jest.fn(),
  onSubunitSelectionChange: jest.fn(),

  hasError: jest.fn(),
  error: jest.fn(),
});

describe("TimeChartView", () => {
  it("TimeChartView", () => {
    const viewModel = viewModelFactory();
    viewModel.chartData.mockReturnValue([]);
    render(<TimeChartView viewModel={viewModel} />);
    expect(screen.getByText("Filter by subUnit")).toBeInTheDocument();
    expect(screen.getByText("Filter by Code (max 7)")).toBeInTheDocument();
  });
});
