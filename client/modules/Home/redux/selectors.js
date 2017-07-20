import { createSelector } from 'reselect';

const selectModule = (state) => state.get('home');
const selectIntl = (state) => state.get('intl');

const selectQuizlist = createSelector(
  selectModule,
  (substate) => substate.get('quizlist')
);

const selectCurrentLocale = createSelector(
  selectIntl,
  (substate) => substate.get('locale')
);

export default {
  selectModule,
  selectQuizlist,
  selectCurrentLocale,
};
