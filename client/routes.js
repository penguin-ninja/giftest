import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Layout from './modules/Layout/Layout';
import Home from './modules/Home/pages/Home';
import Quiz from './modules/Quiz/pages/Quiz';

export default (
  <Route path="/" component={Layout}>
    <IndexRoute component={Home} />
    <Route path="quiz">
      <Route path=":slug" component={Quiz} />
    </Route>
  </Route>
);
