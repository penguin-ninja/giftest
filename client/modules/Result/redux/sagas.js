import { takeEvery } from 'redux-saga';
import { call, put, fork } from 'redux-saga/effects';

import callAPI from 'services/api';
import {
  loadResultSuccess,
  loadResultError,
  setLoading,
} from './actions';
import { LOAD_RESULT_REQUEST } from './constants';

export function* loadResultRequest(action) {
  yield put(setLoading(true));
  try {
    const { resultId } = action;
    const data = yield call(callAPI.bind(null, `result/${resultId}`));
    yield put(loadResultSuccess(data));
  } catch (e) {
    yield put(loadResultError(e));
  }
  yield put(setLoading(false));
}

export default [
  fork(takeEvery, LOAD_RESULT_REQUEST, loadResultRequest),
];