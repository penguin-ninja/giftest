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

export default {
  selectResult,
  selectLoading,
  selectPath,
};
