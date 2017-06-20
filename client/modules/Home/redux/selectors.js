import { createSelector } from 'reselect';

const selectModule = (state) => state.get('home');

const selectQuizzes = createSelector(
  selectModule,
  (substate) => substate.get('quizzes')
);

export default {
  selectModule,
  selectQuizzes,
};
