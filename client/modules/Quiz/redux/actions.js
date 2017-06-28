import * as CONSTANTS from './constants';

export function loadQuizDetailRequest(slug) {
  return {
    type: CONSTANTS.LOAD_QUIZ_DETAIL_REQUEST,
    slug,
  };
}

export function loadQuizDetailSuccess(data) {
  return {
    type: CONSTANTS.LOAD_QUIZ_DETAIL_SUCCESS,
    ...data,
  };
}

export function loadQuizDetailError(error) {
  return {
    type: CONSTANTS.LOAD_QUIZ_DETAIL_ERROR,
    error,
  };
}

export function setSlug(slug) {
  return {
    type: CONSTANTS.SET_SLUG,
    slug,
  };
}

export default {
  loadQuizDetailRequest,
  loadQuizDetailSuccess,
  loadQuizDetailError,
  setSlug,
};
