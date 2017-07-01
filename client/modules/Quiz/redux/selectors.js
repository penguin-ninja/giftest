import { createSelector } from 'reselect';

const selectMain = (state) => state.get('main');
const selectUser = createSelector(
  selectMain,
  (substate) => substate.get('user')
);

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
  selectUser,
};
