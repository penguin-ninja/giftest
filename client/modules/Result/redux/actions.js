import * as CONSTANTS from './constants';

export function loadResultRequest(resultId) {
  return {
    type: CONSTANTS.LOAD_RESULT_REQUEST,
    resultId,
  };
}

export function loadResultSuccess(data) {
  return {
    type: CONSTANTS.LOAD_RESULT_SUCCESS,
    ...data,
  };
}

export function loadResultError(error) {
  return {
    type: CONSTANTS.LOAD_RESULT_ERROR,
    error,
  };
}

export function setLoading(loading) {
  return {
    type: CONSTANTS.SET_LOADING,
    loading,
  };
}

export default {
  loadResultRequest,
  loadResultSuccess,
  loadResultError,
  setLoading,
};
