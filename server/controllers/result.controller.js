import Result from '../models/result';
import errorResponse from '../utils/errorResponse';

// GET one
export function getResult(req, res) {
  const { result } = req;
  res.json({ result });
}

/**
 * Middleware to get result by id or slug
 */
export function getResultMiddleware(req, res, next, id) {
  return Result.findById(id)
  .populate('quiz')
  .populate({ path: 'user', select: 'firstName lastName profileImage' })
  .then((result) => {
    req.result = result;
    return next();
  })
  .catch((err) => {
    errorResponse(res, err);
  });
}
