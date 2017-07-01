import * as CONSTANTS from './constants';

export function loadUserDetailRequest() {
  return {
    type: CONSTANTS.LOAD_USER_DETAIL_REQUEST,
  };
}

export function loadUserDetailSuccess(user) {
  return {
    type: CONSTANTS.LOAD_USER_DETAIL_SUCCESS,
    user,
  };
}

export function loadUserDetailError(error) {
  return {
    type: CONSTANTS.LOAD_USER_DETAIL_ERROR,
    error,
  };
}

export default {
  loadUserDetailRequest,
  loadUserDetailSuccess,
  loadUserDetailError,
};
