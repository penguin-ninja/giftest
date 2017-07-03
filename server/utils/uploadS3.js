import request from 'request';
import AWS from 'aws-sdk';
import guid from 'guid';
import config from '../config';

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

export default function uploadS3(imgUrl) {
  return new Promise((resolve, reject) => {
    request({
      url: imgUrl,
      encoding: null,
    }, (err, res, body) => {
      if (err) {
        return reject(err);
      }

      const id = guid.raw();
      const key = `${config.aws.s3Folder}/${id}.gif`;

      return s3.putObject({
        Bucket: config.aws.s3Bucket,
        Key: key,
        ACL: 'public-read',
        Body: body,
      }, (error) => {
        if (error) {
          return reject(error);
        }

        return resolve(`${config.aws.s3Url}/${key}`);
      });
    });
  });
}
