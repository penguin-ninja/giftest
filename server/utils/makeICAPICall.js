import _ from 'lodash';
import config from '../config';

export default function makeICAPICall(params, customConfig) {
  const morphConfig = _.merge({}, customConfig || config.morphConfig, params);
  const queryArray = Object.keys(morphConfig).map((key) => {
    const val = morphConfig[key];
    if (typeof val === 'string') {
      return `${key}=${encodeURIComponent(val)}`;
    }
    return `${key}=${encodeURIComponent(JSON.stringify(val))}`;
  });
  console.log('*** IC API ***', `${config.morphApiUrl}?${queryArray.join('&')}`);
  return `${config.morphApiUrl}?${queryArray.join('&')}`;
}
