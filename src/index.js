import 'react-app-polyfill/stable'
import 'core-js'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import React from 'react'
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store'
import App from "./App";

const app = (
  <Provider store={store}>
    <App />
  </Provider>
)

if (process.env.BUGSNAG_KEY) {
  Bugsnag.start({
    apiKey: process.env.BUGSNAG_KEY,
    plugins: [new BugsnagPluginReact()],
    enabledReleaseStages: ['production', 'staging'],
    releaseStage: process.env.NODE_ENV
  })

  const ErrorBoundary = Bugsnag.getPlugin('react')
    .createErrorBoundary(React)

  ReactDOM.render(
    <ErrorBoundary>
      {app}
    </ErrorBoundary>,
    document.getElementById('root')
  );
} else {
  ReactDOM.render(
    app,
    document.getElementById('root')
  );
}