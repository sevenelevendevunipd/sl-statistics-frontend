import { observer } from "mobx-react-lite";
import { Skeleton } from "primereact/skeleton";

const InfoRow = observer(
  ({
    caption,
    value,
  }: {
    caption: string;
    value: () => string | number | JSX.Element | undefined;
  }) => (
    <div className="flex justify-content-between mb-3">
      <span className="text-color font-bold">{caption}</span>
      <span className="text-right ml-2">
        {value() ?? <Skeleton width="3em" />}
      </span>
    </div>
  )
);

export default InfoRow;
