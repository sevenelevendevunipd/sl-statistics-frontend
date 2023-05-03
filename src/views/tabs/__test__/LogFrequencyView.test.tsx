import { render } from "@testing-library/react";
import LogFrequencyView from "../LogFrequencyView";
import RootStoreProvider, { RootStore } from "../../../stores/RootStore";

describe("LogFrequencyView", () => {

    it("LogFrequencyView", () => {
        const mockedRootStore = new RootStore();
        const lfv = render(<RootStoreProvider rootStore={mockedRootStore}><LogFrequencyView /></RootStoreProvider>);
        expect(lfv.getByText(/Entries frequency/i)).toBeInTheDocument();
        expect(lfv.getByText(/Filter by Unit\/SubUnit/i)).toBeInTheDocument();
        expect(lfv.getByText(/Filter by Datetime/i)).toBeInTheDocument();
    });    
});