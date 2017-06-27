import { fromJS } from 'immutable';
import * as CONSTANTS from './constants';

const initialState = fromJS({
  quizlist: [],
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CONSTANTS.LOAD_QUIZLIST_SUCCESS:
      return state.set('quizlist', fromJS(action.result));
    default:
  }

  return state;
}

export default homeReducer;
