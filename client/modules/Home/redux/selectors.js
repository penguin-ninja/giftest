import { createSelector } from 'reselect';

const selectModule = (state) => state.get('home');

const selectQuizlist = createSelector(
  selectModule,
  (substate) => substate.get('quizlist')
);

export default {
  selectModule,
  selectQuizlist,
};
