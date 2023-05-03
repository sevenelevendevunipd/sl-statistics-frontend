import { render } from "@testing-library/react";
import TimeChartView from "../TimeChartView";
import RootStoreProvider, { RootStore } from "../../../stores/RootStore";

describe("TimeChartView", () => {

    it("TimeChartView", () => {
        const mockedRootStore = new RootStore();
        const tcv = render(<RootStoreProvider rootStore={mockedRootStore}><TimeChartView /></RootStoreProvider>);
        expect(tcv.getByText("Filter by subUnit")).toBeInTheDocument();
        expect(tcv.getByText("Filter by Code (max 7)")).toBeInTheDocument();
    })    
});