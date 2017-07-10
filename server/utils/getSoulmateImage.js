import { Facebook } from 'fb';
import _ from 'lodash';
import config from '../config';
import FacebookCore from '../../vendors/FacebookCore.es6';
import FacebookEndpointPromises from '../../vendors/FacebookEndpointPromises.es6';
import FacebookDatasourceCore from '../../vendors/DatasourcesCore.es6';
import detectFace from './detectFace';

function checkFace(soulmates, background, index = 0) {
  if (index - 1 > soulmates.length || !soulmates[index]) {
    return Promise.reject(new Error('Can not find soulmate with proper pic'));
  }

  console.log(index, soulmates[index][2].data.url);

  return detectFace({ background, custImg3_url: soulmates[index][2].data.url })
    .then((faceCount) => {
      if (!faceCount) {
        return checkFace(soulmates, background, index + 1);
      }

      return soulmates[index][2].data.url;
    });
}

export default function getSoulmateImage(user, background, algorithm = -1) {
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

  console.log('checking soulmate pics');

  return datasourceCore.get_ordered_soulmates()
  .then((soulmates) => {
    if (soulmates[0][0].id === user.fbId) {
      soulmates.shift();
    }

    console.log(soulmates);

    let newArr;

    if (algorithm === -1) {
      newArr = _.shuffle(soulmates);
    } else {
      newArr = soulmates.slice(algorithm).concat(soulmates.slice(0, algorithm));
    }

    return checkFace(newArr, background, 0);
  });
}
