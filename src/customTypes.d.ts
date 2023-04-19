// allows to import SVGs as ReactComponent
declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// typing for env vars exported by dotenv-webpack
declare namespace ENV {
  const URL_BASE: string;
}
