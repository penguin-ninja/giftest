import _ from 'lodash';
import Result from '../models/result';
import errorResponse from '../utils/errorResponse';
import uploadS3 from '../utils/uploadS3';
import generateMorphedImg from '../utils/generateMorphedImg';
import getSoulmateImage from '../utils/getSoulmateImage';
import getProfileImage from '../utils/getProfileImage';

function getStaticImage(images, algorithm = -1) {
  if (algorithm === -1) {
    return _.shuffle(images)[0];
  }

  return images[algorithm] || images[0];
}

// GET one
export function getResult(req, res) {
  const { result } = req;
  res.json({ result });
}

// Generates Morph Image
export function generateResult(req, res) {
  const { quiz, user } = req.result;
  const staticImages = quiz.resultImages.filter((image) => {
    return !image.gender || !user.gender || image.gender === user.gender;
  }).map((image) => image.url);

  const getImage = quiz.type === 'soulmate' ?
    getSoulmateImage(user, quiz.backgroundImage, quiz.algorithm) :
    getStaticImage(staticImages, quiz.algorithm);

  Promise.all([
    getProfileImage(user, quiz.backgroundImage, quiz.algorithm),
    getImage,
  ])
  .then((resp) => {
    const morphParams = {
      background: quiz.backgroundImage,
      custImg2_url: resp[0],
      custImg3_url: resp[1],
    };
    morphParams.custImg2_effectA_param = quiz.originalImgConfig;
    morphParams.custImg3_effectB_param = quiz.resultImgConfig;
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
  });
}

/**
 * Middleware to get result by id or slug
 */
export function getResultMiddleware(req, res, next, id) {
  return Result.findById(id)
  .populate('quiz')
  .populate({ path: 'user', select: 'firstName lastName gender profileImage fbId fbAccessToken' })
  .then((result) => {
    req.result = result;
    return next();
  })
  .catch((err) => {
    errorResponse(res, err);
  });
}
