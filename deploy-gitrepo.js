const GIT_REPO = process.env.FTP_HOST || 'rsarmiento-pl.github.io';
const GIT_USERNAME = process.env.FTP_HOST || 'rsarmiento-pl';
const GIT_EMAIL = process.env.FTP_HOST || 'rsarmiento@peerlancers.com';
const SSH_PRIVATE_KEY_LOCAL_PATH = process.env.FTP_HOST || '/c/Users/RaymondS/.ssh/id_rsa_peerlancers';
const DIST_PATH = `./dist/${GIT_REPO}/`;
const GIT_HUB_URL_SSH = `git@github.com:${GIT_USERNAME}/${GIT_REPO}.git`;
//Find a way to pass the commit message from Code Repo to Circle Dist Repo
const GIT_COMMIT_MSG = `Auto deployed using Node, SimpleGit and CircleCI ${new Date()}` || process.argv[2].toString();

const git = require('simple-git/promise')(DIST_PATH);

git.cwd(DIST_PATH);
git.addConfig('user.email', GIT_EMAIL);
git.addConfig('user.name', GIT_USERNAME);
git.addConfig('core.sshCommand', `ssh -i ${SSH_PRIVATE_KEY_LOCAL_PATH}`);

// Initialize repo if it is still not initialize, fetch if its already initialize
git.checkIsRepo()
  .then(isRepo => !isRepo && initializeRepo(git))
  .then(() => git.fetch());

// Add all of the changes under dist/repoName
git.add('.').then(
  (success) => {
    console.log("Successfully staged changes");
  }, (error) => {
    console.log(`Failed to Add: ${error}`);
  }
);

// Commit all staged files
git.commit(GIT_COMMIT_MSG)
  .then(
    (success) => {
      console.log('Successfully commmitted changes');
    }, (error) => {
      console.log(`Failed to Commit: ${error}`);
    });

// Push Commited changes to Remote
git.push('origin', 'master', {
    '--force': true
  })
  .then((success) => {
    console.log('Successfully pushed changes to Remote');
  }, (error) => {
   console.log(`Failed to Push: ${error}`);
  });


// Initialize Repo
function initializeRepo(git) {
  return git.init()
    .then(() => git.addRemote('origin', GIT_HUB_URL_SSH))
}
