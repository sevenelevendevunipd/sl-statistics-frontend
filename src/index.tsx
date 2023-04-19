import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { OpenAPI } from "./openapi";
import { configure } from "mobx";

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  disableErrorBoundaries: true,
});

OpenAPI.BASE = ENV.URL_BASE;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
