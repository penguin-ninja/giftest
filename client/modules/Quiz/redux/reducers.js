import { fromJS } from 'immutable';
import * as CONSTANTS from './constants';

const initialState = fromJS({
  quiz: {},
  slug: '',
});

function quizReducer(state = initialState, action) {
  switch (action.type) {
    case CONSTANTS.SET_SLUG:
      return state.set('slug', action.slug);
    case CONSTANTS.LOAD_QUIZ_DETAIL_SUCCESS:
      return state.set('quiz', fromJS(action.quiz));
    default:
  }

  return state;
}

export default quizReducer;
