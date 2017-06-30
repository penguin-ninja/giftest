import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Layout from './modules/Layout/Layout';
import NotFound from './modules/NotFound/NotFound';
import Home from './modules/Home/pages/Home';
import Quiz from './modules/Quiz/pages/Quiz';
import Result from './modules/Result/pages/Result';

export default (
  <Route path="/" component={Layout}>
    <IndexRoute component={Home} />
    <Route path="quiz">
      <Route path=":slug">
        <IndexRoute component={Quiz} />
        <Route path="result">
          <Route path=":resultId" component={Result} />
        </Route>
      </Route>
    </Route>
    <Route path="/404" component={NotFound} />
    <Route path="*" component={NotFound} />
  </Route>
);
