import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { getConfig } from "./config";
import history from "./utils/history";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-country-select/dist/react-bootstrap-country-select.css";

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

// Please see https://auth0.github.io/auth0-react/interfaces/auth0_provider.auth0provideroptions.html
// for a full list of the available properties on the provider
const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  ...(config.audience ? { audience: config.audience } : null),
  redirectUri: window.location.origin,
  onRedirectCallback,
};


ReactDOM.render(
	<Auth0Provider {...providerConfig}>
	  	<App />
	</Auth0Provider>,
	document.getElementById("root")
);
