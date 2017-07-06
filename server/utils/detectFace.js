import request from 'request-promise';
import config from '../config';
import { makeMorphImgUrl } from './generateMorphedImg';

export default function detectFace(params) {
  return request({
    method: 'GET',
    uri: makeMorphImgUrl(params, config.faceDetectConfig),
    json: true,
  }).then((resp) => {
    console.log('face', resp);
    return resp && resp.faces && resp.faces.length;
  });
}
