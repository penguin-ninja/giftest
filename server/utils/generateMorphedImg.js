import config from '../config';

function makeMorphImgUrl(params) {
  const morphConfig = Object.assign({}, config.morphConfig, params);
  const queryArray = Object.keys(morphConfig).map((key) => {
    const val = morphConfig[key];
    if (typeof val === 'string') {
      return `${key}=${encodeURIComponent(val)}`;
    }
    return `${key}=${encodeURIComponent(JSON.stringify(val))}`;
  });
  return `${config.morphApiUrl}?${queryArray.join('&')}`;
}

// function uploadToS3() {
//
// }

/**
 * generates morph image, upload to s3 and returns promise for uploaded image url
 */
export default function generateMorphedImg(params) {
  return Promise.resolve(makeMorphImgUrl(params));
}
