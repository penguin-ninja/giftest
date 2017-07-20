import _ from 'lodash';

export default function getQuizLocale(quiz, lang) {
  const fields = ['headerText', 'bottomText', 'question', 'backgroundImage'];
  const locales = quiz.locale || [];

  const currentLocale = locales.find((locale) => locale.language === lang);
  if (!currentLocale) {
    return _.pick(quiz, fields);
  }

  return currentLocale;
}
