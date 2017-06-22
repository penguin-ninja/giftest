import { enabledLanguages, localizationData } from '../../../../i18n/setup';
import { SWITCH_LANGUAGE } from './actions';
import { fromJS } from 'immutable';

// @TODO load initial language from domain name
const initLocale = (global.navigator && global.navigator.language) || 'en';

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

    default:
      return state;
  }
};

export default IntlReducer;
