import { render, screen } from "@testing-library/react";
import FirmwareChartView from "../FirmwareChartView";

const viewModelFactory = () => ({
  chartData: jest.fn(),
  selectableCodes: jest.fn(),
  selectedCodes: jest.fn(),
  disableCodeOption: jest.fn(),
  onCodeSelectionChange: jest.fn(),

  selectableFirmwares: jest.fn(),
  selectedFirmwares: jest.fn(),
  onFirmwareSelectionChange: jest.fn(),

  hasError: jest.fn(),
  error: jest.fn(),
});

describe("FirmwareChartView", () => {
  it("FirmwareChartView", () => {
    const viewModel = viewModelFactory();
    viewModel.chartData.mockReturnValue([]);
    render(<FirmwareChartView viewModel={viewModel} />);
    expect(screen.getByText(/Filter by Firmware/i)).toBeInTheDocument();
    expect(screen.getByText(/Filter by Code \(max 7\)/i)).toBeInTheDocument();
  });
});
