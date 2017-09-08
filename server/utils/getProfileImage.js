import { Facebook } from 'fb';
import config from '../config';
import FacebookCore from '../../vendors/FacebookCore.es6';
import FacebookEndpointPromises from '../../vendors/FacebookEndpointPromises.es6';
import FacebookDatasourceCore from '../../vendors/DatasourcesCore.es6';
import detectFace from './detectFace';

function checkFace(photos, background, index = 0) {
  if (index - 1 > photos.length || !photos[index]) {
    // just fallback to first pic
    return Promise.resolve({
      fallback: photos[0],
    });
    // return Promise.reject(new Error('Can not find proper profile pic'));
  }

  console.log(index, photos[index]);

  return detectFace({ background, custImg3_url: photos[index] })
    .then((faceCount) => {
      if (faceCount !== 1) {
        return checkFace(photos, background, index + 1);
      }

      return photos[index];
    });
}

export default function getSoulmateImage(user, background) {
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

  // get profile pic, and all photos from the user
  // and check until facecount = 1
  return Promise.all([
    datasourceCore.get_nodes_data([user.fbId]),
    fbPromises.get_all_photos(user.fbId),
  ])
  .then((resp) => {
    console.log('checking profile faces');
    const photos = resp[1].map((item) => item.source);
    photos.unshift(resp[0][0][2].data.url);
    return checkFace(photos, background, 0);
  });
}
