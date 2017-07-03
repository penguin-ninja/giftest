import Result from '../models/result';
import errorResponse from '../utils/errorResponse';
import uploadS3 from '../utils/uploadS3';
import generateMorphedImg from '../utils/generateMorphedImg';

// GET one
export function getResult(req, res) {
  const { result } = req;
  res.json({ result });
}

// Generated Morph Image
export function generateResult(req, res) {
  const { quiz, user } = req.result;

  const morphParams = {
    background: quiz.backgroundImage,
    custImg2_url: user.profileImage,
    custImg3_url: quiz.resultImage,
  };

  generateMorphedImg(morphParams)
  .then((imgUrl) => {
    return uploadS3(imgUrl);
  })
  .then((s3Url) => {
    req.result.image = s3Url;
    return req.result.save();
  })
  .then((result) => {
    res.json({ result });
  });
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
