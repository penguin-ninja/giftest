import Result from '../models/result';
import errorResponse from '../utils/errorResponse';
import uploadS3 from '../utils/uploadS3';
import generateMorphedImg from '../utils/generateMorphedImg';
import getSoulmateImage from '../utils/getSoulmateImage';
import getProfileImage from '../utils/getProfileImage';

// GET one
export function getResult(req, res) {
  const { result } = req;
  res.json({ result });
}

// generate soulmate result based on FB api result
export function generateSoulmateResult(req, res) {
  const { quiz, user } = req.result;

  Promise.all([
    getProfileImage(user, quiz.backgroundImage),
    getSoulmateImage(user, quiz.backgroundImage),
  ])
  .then((resp) => {
    const morphParams = {
      background: quiz.backgroundImage,
      custImg2_url: resp[0],
      custImg3_url: resp[1],
    };
    console.log(morphParams);
    return generateMorphedImg(morphParams);
  })
  .then((imgUrl) => {
    return uploadS3(imgUrl, req.result._id.toString());
  })
  .then((s3Url) => {
    req.result.image = s3Url;
    req.result.generated = true;
    return req.result.save();
  })
  .then((result) => {
    res.json({ result });
  })
  .catch(err => {
    console.error(err); // eslint-disable-line no-console
  });
}

// Generates Morph Image
export function generateResult(req, res) {
  const { quiz, user } = req.result;

  const morphParams = {
    background: quiz.backgroundImage,
    custImg2_url: user.profileImage,
    custImg3_url: quiz.resultImage,
  };

  generateMorphedImg(morphParams)
  .then((imgUrl) => {
    return uploadS3(imgUrl, req.result._id.toString());
  })
  .then((s3Url) => {
    req.result.image = s3Url;
    req.result.generated = true;
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
  .populate({ path: 'user', select: 'firstName lastName profileImage fbId fbAccessToken' })
  .then((result) => {
    req.result = result;
    return next();
  })
  .catch((err) => {
    errorResponse(res, err);
  });
}
