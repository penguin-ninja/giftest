import path from 'path';
require('dotenv').config({ path: path.resolve('./.env') });
import uploadS3, { directUpload } from './utils/uploadS3';

const startTime = new Date().getTime() / 1000;
console.log('starting upload');

// directUpload(path.resolve('./server/test.gif'), 'testImg')
uploadS3('http://static.animatedtest.com/prod/5982dd6c7797ca53dfccab1a.gif', 'testImg')
.then(() => {
  const endTime = new Date().getTime() / 1000;

  console.log(`Time taken ${endTime - startTime}`);
})
.catch((err) => {
  console.log(err);
});
