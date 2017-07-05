import { Facebook } from 'fb';
import FacebookCore from '../../vendors/FacebookCore.es6';
import FacebookEndpointPromises from '../../vendors/FacebookEndpointPromises.es6';
import FacebookDatasourceCore from '../../vendors/DatasourcesCore.es6';
import config from '../config';
import Result from '../models/result';
import errorResponse from '../utils/errorResponse';
import uploadS3 from '../utils/uploadS3';
import generateMorphedImg from '../utils/generateMorphedImg';

// GET one
export function getResult(req, res) {
  const { result } = req;
  res.json({ result });
}

export function generateSoulmateResult(req, res) {
  const { quiz, user } = req.result;
  const fb = new Facebook({
    version: config.facebook.apiVersion,
    appId: config.facebook.clientID,
    appSecret: config.facebook.clientSecret,
  });

  fb.setAccessToken(user.fbAccessToken);

  const fbCore = new FacebookCore(fb);
  const fbPromises = new FacebookEndpointPromises(fbCore, {
    max_items: 100,
    limit: 25,
    bulk_max_items: 20,
  });
  const datasourceCore = new FacebookDatasourceCore({
    fb_core: fbCore,
    fb_promises: fbPromises,
  });

  Promise.all([
    datasourceCore.get_nodes_data([user.fbId]),
    datasourceCore.get_ordered_soulmates(),
  ])
  .then((resp) => {
    const nodesData = resp[0];
    const soulmates = resp[1];

    const soulmate = soulmates[0][0].id !== user.fbId ? soulmates[0] : soulmates[1];
    if (!soulmate) {
      throw new Error('Soulmate not found!');
    }

    const morphParams = {
      background: quiz.backgroundImage,
      custImg2_url: nodesData[0][2].data.url,
      custImg3_url: soulmate[2].data.url,
    };
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
