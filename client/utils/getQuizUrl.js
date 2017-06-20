const convertToSlug = (text = '') =>
  text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

export default function getQuizUrl(quizId, title) {
  const slug = convertToSlug(title);
  return `${process.env.SITE_URL}/quiz/${slug}/${quizId}`;
}
