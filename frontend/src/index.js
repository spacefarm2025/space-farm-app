import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import RoutesComponent from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router>
      <RoutesComponent />
    </Router>
  </Provider>
);
