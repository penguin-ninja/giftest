import { createSelector } from 'reselect';

const selectIntl = (state) => state.get('intl');

const selectEnabledLangs = createSelector(
  selectIntl,
  (substate) => substate.get('enabledLanguages')
);

const selectCurrentLocale = createSelector(
  selectIntl,
  (substate) => substate.get('locale')
);

export default {
  selectIntl,
  selectEnabledLangs,
  selectCurrentLocale,
};
