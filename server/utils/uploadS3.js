import request from 'request';
import AWS from 'aws-sdk';
import config from '../config';
import fs from 'fs';

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

export function directUpload(path, id, fileFormat = 'gif', contentType = 'image/gif') {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, body) => {
      if (err) throw err; // Something went wrong!
      const key = `${config.aws.s3Folder}/${id}.${fileFormat}`;

      return s3.putObject({
        Bucket: config.aws.s3Bucket,
        Key: key,
        ACL: 'public-read',
        Body: body,
        ContentType: contentType,
      }, (error) => {
        if (error) {
          return reject(error);
        }

        return resolve(`${config.aws.s3Url}/${key}`);
      });
    });
  });
}

export default function uploadS3(imgUrl, id, fileFormat = 'gif', contentType = 'image/gif') {
  const startTime = new Date().getTime() / 1000;
  console.log(imgUrl);
  return new Promise((resolve, reject) => {
    request({
      url: imgUrl,
      encoding: null,
    }, (err, res, body) => {
      if (err) {
        return reject(err);
      }

      const key = `${config.aws.s3Folder}/${id}.${fileFormat}`;

      return s3.putObject({
        Bucket: config.aws.s3Bucket,
        Key: key,
        ACL: 'public-read',
        Body: body,
        ContentType: contentType,
      }, (error) => {
        if (error) {
          return reject(error);
        }

        const endTime = new Date().getTime() / 1000;
        console.log(`Time taken on upload ${endTime - startTime}`);

        return resolve(`${config.aws.s3Url}/${key}`);
      });
    });
  });
}
