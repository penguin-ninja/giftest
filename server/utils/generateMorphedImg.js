import request from 'request-promise';
import makeICAPICall from './makeICAPICall';

/**
 * generates morph image, upload to s3 and returns promise for uploaded image url
 */
export default function generateMorphedImg(params) {
  return Promise.resolve(makeICAPICall(params));
}

export function generateAndUpload(params) {
  return request({
    method: 'GET',
    uri: makeICAPICall(params),
    json: true,
  }).then((resp) => {
    return resp.S3ImageURL;
  });
}
