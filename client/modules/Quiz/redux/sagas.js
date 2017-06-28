import { takeEvery } from 'redux-saga';
import { call, put, fork, select } from 'redux-saga/effects';

import callAPI from 'services/api';
import {
  loadQuizDetailSuccess,
  loadQuizDetailError,
  setSlug,
} from './actions';
import { LOAD_QUIZ_DETAIL_REQUEST } from './constants';
import selectors from './selectors';

export function* loadQuizDetailRequest(action) {
  try {
    const { slug } = action;
    const state = yield select();
    const quizlist = selectors.selectQuizlist(state);
    const currentSlug = selectors.selectSlug(state);
    let quiz = null;
    let data;
    if (currentSlug !== slug) {
      quiz = quizlist.find((q) => q.get('slug') === slug);

      if (quiz) {
        data = { quiz: quiz.toJS() };
      } else {
        data = yield call(callAPI.bind(null, `quizzes/${slug}`));
      }

      yield put(loadQuizDetailSuccess(data));
      yield put(setSlug(slug));
    }
  } catch (e) {
    yield put(loadQuizDetailError(e));
  }
}

export default [
  fork(takeEvery, LOAD_QUIZ_DETAIL_REQUEST, loadQuizDetailRequest),
];
