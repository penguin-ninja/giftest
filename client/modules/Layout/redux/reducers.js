import { fromJS } from 'immutable';
import * as CONSTANTS from './constants';

const initialState = fromJS({
  user: null,
});

function mainReducer(state = initialState, action) {
  switch (action.type) {
    case CONSTANTS.LOAD_USER_DETAIL_SUCCESS:
      return state.set('user', fromJS(action.user));
    default:
  }

  return state;
}

export default mainReducer;
