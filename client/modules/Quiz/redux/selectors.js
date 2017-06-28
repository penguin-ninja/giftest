import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const selectQuizlist = createSelector(
  selectHome,
  (substate) => substate.get('quizlist')
);

const selectModule = (state) => state.get('quiz');

const selectQuizDetail = createSelector(
  selectModule,
  (substate) => substate.get('quiz')
);

const selectSlug = createSelector(
  selectModule,
  (substate) => substate.get('slug')
);

export default {
  selectModule,
  selectQuizlist,
  selectQuizDetail,
  selectSlug,
};
