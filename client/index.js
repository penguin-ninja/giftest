import React from 'react';
import { render } from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import history from './history';
import { configureStore } from './redux/store';
import { selectLocationState } from './redux/selectors';
import rootSaga from './redux/sagas';

// Initialize store
const store = configureStore(history, window.__INITIAL_STATE__);
const syncedHistory = syncHistoryWithStore(history, store, {
  selectLocationState,
});
const mountApp = document.getElementById('root');

store.runSaga(rootSaga);

render(
  <AppContainer>
    <App store={store} history={syncedHistory} />
  </AppContainer>,
  mountApp
);

// For hot reloading of react components
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default; // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextApp store={store} />
      </AppContainer>,
      mountApp
    );
  });
}
