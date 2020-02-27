const git = require('simple-git');

git().status((err, result) => {
  console.log(result);
});
