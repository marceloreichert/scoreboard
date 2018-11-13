const octokit = require('@octokit/rest')()
const config = require('../config');

async function listComments(params) {
  await auth();
  return await octokit.gists.getComments({gist_id: params});
}

async function addGist(params) {
  await auth();
  return octokit.gists.create(params);
}

function auth() {
  return octokit.authenticate({
    type: 'basic',
    username: config.github.user,
    password: config.github.password
  });
}

module.exports = {
  addGist: addGist,
  listComments: listComments
}
