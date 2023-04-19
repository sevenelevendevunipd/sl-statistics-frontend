import { observer } from "mobx-react-lite";
import { BlockUIProps, BlockUI } from "primereact/blockui";
import { ProgressSpinner } from "primereact/progressspinner";
import { PropsWithChildren } from "react";

const BlockUIObserver = observer(
  ({
    children,
    shouldBlock,
    props = {},
  }: {
    shouldBlock: () => boolean;
    props?: BlockUIProps;
  } & PropsWithChildren) => (
    <BlockUI
      {...props}
      blocked={shouldBlock()}
      template={props.template ?? <ProgressSpinner />}
    >
      {children}
    </BlockUI>
  )
);

export default BlockUIObserver;
