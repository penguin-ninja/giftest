import { localizationData } from '../../../../i18n/setup';

// Export Constants
export const SWITCH_LANGUAGE = 'SWITCH_LANGUAGE';
export const SET_LOCALE = 'SET_LOCALE';

export function switchLanguage(newLang) {
  return {
    type: SWITCH_LANGUAGE,
    ...localizationData[newLang],
  };
}
