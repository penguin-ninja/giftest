import { enabledLanguages, localizationData } from '../../../../i18n/setup';
import { SWITCH_LANGUAGE, SET_LOCALE } from './actions';
import { fromJS } from 'immutable';

const initLocale = 'en';

const initialState = fromJS({
  locale: initLocale,
  enabledLanguages,
  ...(localizationData[initLocale] || {}),
});

const IntlReducer = (state = initialState, action) => {
  switch (action.type) {
    case SWITCH_LANGUAGE: {
      const { type, ...actionWithoutType } = action; // eslint-disable-line
      return state.merge(actionWithoutType);
    }

    case SET_LOCALE:
      return state.merge({ ...(localizationData[action.locale] || {}) });
    default:
      return state;
  }
};

export default IntlReducer;
