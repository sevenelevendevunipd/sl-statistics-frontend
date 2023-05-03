import { render } from "@testing-library/react";
import FirmwareChartView from "../FirmwareChartView";
import RootStoreProvider, { RootStore } from "../../../stores/RootStore";

describe("FirmwareChartView", () => {

    it("FirmwareChartView", () => {
        const mockedRootStore = new RootStore();
        const fcv = render(<RootStoreProvider rootStore={mockedRootStore}><FirmwareChartView /></RootStoreProvider>);
        expect(fcv.getByText(/Filter by Firmware/i)).toBeInTheDocument();
        expect(fcv.getByText(/Filter by Code \(max 7\)/i)).toBeInTheDocument();
    })    
});