import { takeEvery } from 'redux-saga';
import { call, put, fork } from 'redux-saga/effects';

import callAPI from 'services/api';
import {
  loadUserDetailSuccess,
  loadUserDetailError,
} from './actions';
import { LOAD_USER_DETAIL_REQUEST } from './constants';

export function* loadUserDetailRequest() {
  try {
    const data = yield call(callAPI.bind(null, 'me'));

    if (data.error) {
      throw data.error;
    }

    yield put(loadUserDetailSuccess(data.response));
  } catch (e) {
    yield put(loadUserDetailError(e));
  }
}

export default [
  fork(takeEvery, LOAD_USER_DETAIL_REQUEST, loadUserDetailRequest),
];
