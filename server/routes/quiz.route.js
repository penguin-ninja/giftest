import { Router } from 'express';
import * as QuizController from '../controllers/quiz.controller';
import * as ResultController from '../controllers/result.controller';

const router = new Router();

router.route('/quizzes')
  .get(QuizController.getQuizList)
  .post(QuizController.addQuiz);

router.route('/quizzes/:slug')
  .get(QuizController.getQuiz)
  .put(QuizController.updateQuiz)
  .delete(QuizController.deleteQuiz);

router.route('/result/:resultId')
  .get(ResultController.getResult);

router.route('/result/:resultId/generateResult')
  .get(ResultController.generateResult);

router.route('/result/:resultId/generateSoulmateResult')
  .get(ResultController.generateSoulmateResult);

router.param('slug', QuizController.getQuizMiddleware);
router.param('resultId', ResultController.getResultMiddleware);

export default router;
