import { fromJS } from 'immutable';
import * as CONSTANTS from './constants';

const initialState = fromJS({
  result: {},
  loading: false,
});

function resultReducer(state = initialState, action) {
  switch (action.type) {
    case CONSTANTS.SET_LOADING:
      return state.set('loading', action.loading);
    case CONSTANTS.LOAD_RESULT_SUCCESS:
      return state.set('result', fromJS(action.result));
    default:
  }

  return state;
}

export default resultReducer;
