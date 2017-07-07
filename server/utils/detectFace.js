import request from 'request-promise';
import config from '../config';
import makeICAPICall from './makeICAPICall';

export default function detectFace(params) {
  return request({
    method: 'GET',
    uri: makeICAPICall(params, config.faceDetectConfig),
    json: true,
  }).then((resp) => {
    console.log('face', resp);
    return resp && resp.faces && resp.faces.length;
  });
}
