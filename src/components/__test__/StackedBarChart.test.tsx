import { render, screen } from "@testing-library/react";
import StackedBarChart from "../StackedBarChart";
import { useThemeName } from "../ThemeSwitcher";
import MainView from "../../views/MainView";

//const useThemeName = jest.fn();
jest.mock("../ThemeSwitcher", () => ({
    useThemeName: jest.fn(),
}));

describe("StackedBarChart component", () => {
    const dataset = [
        { month: "January", apples: "10", oranges: "5", total: "15" },
        { month: "February", apples: "15", oranges: "10", total: "25" },
        { month: "March", apples: "20", oranges: "15", total: "35" },
    ];

    beforeEach(() => {
        //useThemeName.mockReturnValue("dark");
        (useThemeName as jest.Mock).mockReturnValue("dark");
    });

    it("should render a message if the dataset is empty", () => {
        const { getByText } = render(
            <StackedBarChart dataset={[]} xKey="month" />
        );
        expect(getByText("No entries to plot!")).toBeInTheDocument();
    });

    it('should render a bar chart with the correct data', () => {
        const { container } = render(<StackedBarChart dataset={dataset} xKey="month" />);
        expect(container.querySelector('.echarts-for-react')).toBeInTheDocument();
    });
});