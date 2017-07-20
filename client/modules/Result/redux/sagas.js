import { takeEvery } from 'redux-saga';
import { call, put, fork, select } from 'redux-saga/effects';

import callAPI from 'services/api';
import {
  loadResultSuccess,
  loadResultError,
  setLoading,
} from './actions';
import { LOAD_RESULT_REQUEST, GENERATE_RESULT_REQUEST } from './constants';
import selectors from './selectors';

export function* loadResultRequest(action) {
  yield put(setLoading(true));
  try {
    const { resultId } = action;
    const data = yield call(callAPI.bind(null, `result/${resultId}`));

    if (data.error) {
      throw data.error;
    }

    yield put(loadResultSuccess(data.response));
  } catch (e) {
    yield put(loadResultError(e));
  }
  yield put(setLoading(false));
}

export function* generateResultRequest(action) {
  yield put(setLoading(true));
  try {
    const state = yield select();
    const lang = selectors.selectCurrentLocale(state);
    const { resultId } = action;
    const data = yield call(callAPI.bind(null, `result/${resultId}/generateResult?lang=${lang}`));
    if (data.error) {
      throw data.error;
    }
    yield put(loadResultSuccess(data.response));
  } catch (e) {
    yield put(loadResultError(e));
  }
  yield put(setLoading(false));
}

export default [
  fork(takeEvery, LOAD_RESULT_REQUEST, loadResultRequest),
  fork(takeEvery, GENERATE_RESULT_REQUEST, generateResultRequest),
];
