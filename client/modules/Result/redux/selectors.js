import { createSelector } from 'reselect';

const selectModule = (state) => state.get('result');

const selectResult = createSelector(
  selectModule,
  (substate) => substate.get('result')
);

const selectLoading = createSelector(
  selectModule,
  (substate) => substate.get('loading')
);

const selectPath = (state) => state.get('route').get('locationBeforeTransitions').pathname;
const selectIntl = (state) => state.get('intl');
const selectCurrentLocale = createSelector(
  selectIntl,
  (substate) => substate.get('locale')
);

export default {
  selectResult,
  selectLoading,
  selectPath,
  selectCurrentLocale,
};
