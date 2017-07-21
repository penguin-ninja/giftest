import { enabledLanguages, localizationData } from '../../../../i18n/setup';
import { SWITCH_LANGUAGE } from './actions';
import { fromJS } from 'immutable';

let initLocale = global.defaultLang;
if (enabledLanguages.indexOf(initLocale) === -1) {
  initLocale = 'en';
}

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
