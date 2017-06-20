import { combineReducers } from 'redux-immutable';

// Import Reducers
import routerReducer from './routerReducer';
import homeReducer from 'modules/Home/redux/reducers';

// Combine all reducers into one root reducer
export default combineReducers({
  route: routerReducer,
  home: homeReducer,
});
