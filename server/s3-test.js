const path = require('path');
require('dotenv').config({ path: path.resolve('./.env') });
const uploadS3 = require('./utils/uploadS3').default;

// directUpload(path.resolve('./server/test.gif'), 'testImg')
uploadS3('http://static.animatedtest.com/prod/5982dd6c7797ca53dfccab1a.gif', 'testImg')
.then(() => {
  console.log('finished');
})
.catch((err) => {
  console.log(err);
});
