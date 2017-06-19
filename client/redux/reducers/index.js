import { combineReducers } from 'redux-immutable';

// Import Reducers
import routerReducer from './routerReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  route: routerReducer,
});
