import makeICAPICall from './makeICAPICall';

/**
 * generates morph image, upload to s3 and returns promise for uploaded image url
 */
export default function generateMorphedImg(params) {
  return Promise.resolve(makeICAPICall(params));
}
