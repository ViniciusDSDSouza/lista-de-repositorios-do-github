import {
  GITHUB_AUTH_URL,
  GITHUB_CLIENT_ID,
  ENDPOINT_CALLBACK,
} from "../config/env.js";

export const getAuthGithub = (req, res) => {
  const githubAuthUrl = `${GITHUB_AUTH_URL}client_id=${GITHUB_CLIENT_ID}&redirect_uri=${ENDPOINT_CALLBACK}&scope=repo,delete_repo`;
  res.redirect(githubAuthUrl);
};
