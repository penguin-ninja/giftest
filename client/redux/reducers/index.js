import { combineReducers } from 'redux-immutable';

// Import Reducers
import routerReducer from './routerReducer';
import homeReducer from 'modules/Home/redux/reducers';
import quizReducer from 'modules/Quiz/redux/reducers';
import resultReducer from 'modules/Result/redux/reducers';
import mainReducer from 'modules/Layout/redux/reducers';
import intl from 'modules/Intl/redux/reducers';

// Combine all reducers into one root reducer
export default combineReducers({
  route: routerReducer,
  main: mainReducer,
  home: homeReducer,
  quiz: quizReducer,
  result: resultReducer,
  intl,
});
