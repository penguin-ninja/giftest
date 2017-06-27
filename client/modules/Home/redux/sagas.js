import { takeEvery } from 'redux-saga';
import { call, put, fork } from 'redux-saga/effects';

import callAPI from 'services/api';
import { loadQuizlistSuccess, loadQuizlistError } from './actions';
import { LOAD_QUIZLIST_REQUEST } from './constants';

// @TODO load with pagination
export function* loadQuizlistRequest() {
  try {
    const data = yield call(callAPI.bind(null, 'quizzes'));
    yield put(loadQuizlistSuccess(data));
  } catch (e) {
    yield put(loadQuizlistError(e));
  }
}

export default [
  fork(takeEvery, LOAD_QUIZLIST_REQUEST, loadQuizlistRequest),
];
