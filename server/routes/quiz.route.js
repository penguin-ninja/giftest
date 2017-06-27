import { Router } from 'express';
import * as QuizController from '../controllers/quiz.controller';

const router = new Router();

router.route('/quizzes')
  .get(QuizController.getQuizList)
  .post(QuizController.addQuiz);

router.route('/quizzes/:slug')
  .get(QuizController.getQuiz)
  .put(QuizController.updateQuiz)
  .delete(QuizController.deleteQuiz);

router.param('slug', QuizController.getQuizMiddleware);

export default router;
