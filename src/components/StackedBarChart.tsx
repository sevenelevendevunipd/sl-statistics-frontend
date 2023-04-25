import EChartsReact from "echarts-for-react";
import { CSSProperties } from "react";

import { useThemeName } from "./ThemeSwitcher";

type Dataset = Record<string, string>[];

const datasetKeys = (dataset: Dataset, xKey: string) => {
  const keys = Object.keys(dataset[0]);
  keys.splice(keys.indexOf(xKey), 1);
  return keys;
};

type ChartProps = {
  className?: string;
  dataset: Dataset;
  xKey: string;
  isXLabelRotated?: boolean;
  style?: CSSProperties;
};

const makeOption = (
  dataset: Dataset,
  xKey: string,
  yKeys: string[],
  isXLabelRotated: boolean
) => {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {},
    dataset: [
      {
        source: dataset,
      },
    ],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLabel: {
        rotate: isXLabelRotated ? 90 : 0,
      },
    },
    yAxis: {
      type: "value",
    },
    series: yKeys.map((yKey) => ({
      name: yKey,
      type: "bar",
      stack: yKey == "total" ? "total" : "stack",
      encode: {
        x: xKey,
        y: yKey,
      },
    })),
  };
};

const StackedBarChart = (props: ChartProps) => {
  if (props.dataset.length == 0) {
    return <b>No entries to plot!</b>;
  }

  const theme = useThemeName();
  const yKeys = datasetKeys(props.dataset, props.xKey);
  return (
    <EChartsReact
      style={props.style}
      className={props.className}
      theme={theme}
      option={makeOption(
        props.dataset,
        props.xKey,
        yKeys,
        props.isXLabelRotated ?? false
      )}
      key={yKeys.join(",")}
    />
  );
};

export default StackedBarChart;
