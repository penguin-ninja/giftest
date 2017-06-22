import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import IntlWrapper from 'modules/Intl/IntlWrapper';

// Import Routes
import routes from './routes';

// Base stylesheet
require('bootstrap-loader');
require('./main.css');

export default function App(props) {
  return (
    <Provider store={props.store}>
      <IntlWrapper>
        <Router history={props.history}>
          {routes}
        </Router>
      </IntlWrapper>
    </Provider>
  );
}

App.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
