import config from '../config';
import makeICAPICall from './makeICAPICall';

/**
 * generates morph image, upload to s3 and returns promise for uploaded image url
 */
export default function getBackgroundImage(topText = '', bottomText = '') {
  return makeICAPICall({
    textbox2_text: topText,
    textbox3_text: bottomText,
  }, config.backgroundConfig);
}
