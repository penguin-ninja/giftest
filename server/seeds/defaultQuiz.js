import Quiz from '../models/quiz';

const quizData = {
  question: 'How many people do you need and how many do you have?',
  titleImage: 'https://image.nametests.com/global_cliparts/2017/03/22/default_quiz_promo_thumb.jpg',
  resultImage: 'http://dev01.dev103.social-net.me:8080/imagecreator/temp/face3.jpg',
  backgroundImage: 'http://dev01.dev103.social-net.me:8080/imagecreator/temp/morphimgbgd.png',
  localeData: [{
    lang: 'de',
    question: 'Wie viele Leute brauchen Dich und wie viele kommen ohne Dich aus?',
    titleImage: 'https://image.nametests.com/cache/images/promote_image/2017/06/26/,52fef7b780c0db89c6ecb409de003ef4/456fa6e81485935c756865cc786244c7.jpg',
  }],
};

export default function addDefaultQuiz() {
  const newQuiz = new Quiz(quizData);
  return newQuiz.save();
}
