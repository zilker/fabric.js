let fs = require('fs'),
  simpleGit = require('simple-git/promise'),
  git = simpleGit();

git.status().then(async (status) => {
  try {
    if (!status.files.length) {
      let gitignore = fs.readFileSync('./.gitignore', 'utf8'),
        regex = new RegExp('/dist', 'i'),
        result = gitignore.replace(regex, '');

      fs.writeFileSync('./.gitignore', result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
      await git.add('.');
      await git.commit('Edit .gitignore to publish');
      await git.raw([
        'subtree',
        'push',
        '--prefix',
        'dist',
        'origin',
        'gh-pages'
      ]);
      await git.reset(['HEAD~']);
      await git.checkout('.gitignore');
    } else {
      console.log('Need clean working directory to publish');
    }
  } catch (e) {
    console.error(e);
  }
}).catch(e => {
  console.error(e);
});
