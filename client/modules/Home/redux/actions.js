import * as CONSTANTS from './constants';

export function loadQuizlistRequest() {
  return {
    type: CONSTANTS.LOAD_QUIZLIST_REQUEST,
  };
}

export function loadQuizlistSuccess(data) {
  return {
    type: CONSTANTS.LOAD_QUIZLIST_SUCCESS,
    ...data,
  };
}

export function loadQuizlistError(error) {
  return {
    type: CONSTANTS.LOAD_QUIZLIST_ERROR,
    error,
  };
}

export default {
  loadQuizlistRequest,
  loadQuizlistSuccess,
  loadQuizlistError,
};
