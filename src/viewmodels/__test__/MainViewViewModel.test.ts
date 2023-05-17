import { LogListStore } from "../../stores/LogListStore";
import { SelectedLogsInfoStore } from "../../stores/SelectedLogsInfoStore";
import { IMainViewViewModel, MainViewViewModel } from "../MainViewViewModel";

jest.mock("../../stores/LogListStore");
jest.mock("../../stores/SelectedLogsInfoStore");

describe("MainViewViewModel", () => {
    let logListStore: jest.Mocked<LogListStore>;
    let selectedLogsInfoStore: jest.Mocked<SelectedLogsInfoStore>;
    let rootStore;
    let viewModel: IMainViewViewModel;

    beforeEach(() => {
        logListStore = new LogListStore() as any;
        selectedLogsInfoStore = new SelectedLogsInfoStore() as any;
        rootStore = {
            logListStore,
            selectedLogsInfoStore,
        }
        viewModel = MainViewViewModel(rootStore as any);
    })

    it("updateLogList", () => {
        viewModel.updateLogList();
        expect(logListStore.updateLogList).toBeCalled();
    })

    it("tabsDisabled", () => {
        Object.defineProperty(logListStore, "hasLogs", {value: true});
        Object.defineProperty(selectedLogsInfoStore, "info", {value: {total_entries: 0}})
        expect(viewModel.tabsDisabled()).toBe(true);
    })
})