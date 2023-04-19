import { useId } from "react";
import CalendarHOC from "./CalendarHOC";
import { observer } from "mobx-react-lite";
import { max, min } from "../utils";
import { Card } from "primereact/card";

const MinCalendar = observer(
  ({
    minAllowed,
    maxAllowed,
    minValue,
    maxValue,
    onMinChange,
    id,
  }: RangePickerCalendarProps) => (
    <CalendarHOC
      id={id}
      value={minValue()}
      minDate={minAllowed()}
      maxDate={min(maxValue(), maxAllowed())}
      onChange={(ev) => onMinChange(ev.value as Date)}
    />
  )
);

const MaxCalendar = observer(
  ({
    minAllowed,
    maxAllowed,
    minValue,
    maxValue,
    onMaxChange,
    id,
  }: RangePickerCalendarProps) => (
    <CalendarHOC
      id={id}
      value={maxValue()}
      minDate={max(minValue(), minAllowed())}
      maxDate={maxAllowed()}
      onChange={(ev) => onMaxChange(ev.value as Date)}
    />
  )
);

export type RangePickerProps = {
  title: string;
  minAllowed: () => Date;
  maxAllowed: () => Date;
  minValue: () => Date;
  maxValue: () => Date;
  onMinChange: (value: Date) => void;
  onMaxChange: (value: Date) => void;
  className?: string;
};

type RangePickerCalendarProps = RangePickerProps & {
  id: string;
};

const RangePicker = (props: RangePickerProps) => {
  const idBase = useId();
  return (
    <Card title={props.title} className={"m-2 " + (props.className ?? "")}>
      <div className="flex flex-wrap gap-3 p-fluid">
        <div className="flex-auto">
          <label htmlFor={idBase + "minCal"} className="font-bold block mb-2">
            Start
          </label>
          <MinCalendar {...props} id={idBase + "minCal"} />
        </div>
        <div className="flex-auto">
          <label htmlFor={idBase + "maxCal"} className="font-bold block mb-2">
            End
          </label>
          <MaxCalendar {...props} id={idBase + "maxCal"} />
        </div>
      </div>
    </Card>
  );
};
export default RangePicker;
