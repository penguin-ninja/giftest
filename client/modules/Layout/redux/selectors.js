import { createSelector } from 'reselect';

const selectModule = (state) => state.get('main');

const selectUser = createSelector(
  selectModule,
  (substate) => substate.get('user')
);

export default {
  selectUser,
};
