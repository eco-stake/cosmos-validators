import 'react-app-polyfill/stable'
import 'core-js'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import React from 'react'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'
import store from './store'
import App from "./App";

const container = document.getElementById('root');
const root = createRoot(container);
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

  root.render(
    <ErrorBoundary>
      {app}
    </ErrorBoundary>
  );
} else {
  root.render(
    app
  );
}