import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";

import App from "./App";
import { Provider } from "./charSheets/root/services/store";
import { ErrorBoundry } from "./uiLib/ErrorBoundry";
import { ToastProvider } from "./uiLib/ToastNotification";

ReactDOM.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <Provider>
    <ToastProvider>
      <React.StrictMode>
        <ErrorBoundry>
          <Router>
            <App />
          </Router>
        </ErrorBoundry>
      </React.StrictMode>
    </ToastProvider>
  </Provider>,
);
