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

export default {
  selectResult,
  selectLoading,
};
