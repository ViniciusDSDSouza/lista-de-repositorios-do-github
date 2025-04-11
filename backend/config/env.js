import dotenv from "dotenv";
dotenv.config();

// Variáveis do usuário
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const GITHUB_JWT_SECRET_KEY = process.env.GITHUB_JWT_SECRET_KEY;

// Variáveis da API Github
export const GITHUB_AUTH_URL = process.env.GITHUB_AUTH_URL;
export const GITHUB_ACCESS_TOKKEN_URL = process.env.GITHUB_ACCESS_TOKKEN_URL;
export const GITHUB_CREATE_REPO_URL = process.env.GITHUB_CREATE_REPO_URL;
export const GITHUB_PAT = process.env.GITHUB_PAT;

// Variáveis FRONTEND
export const FRONTEND_REDIRECT_INDEX = process.env.FRONTEND_REDIRECT_INDEX;
export const FRONTEND_REDIRECT_REPOS = process.env.FRONTEND_REDIRECT_REPOS;

// Variáveis BACKEND
export const ENDPOINT_CALLBACK = process.env.ENDPOINT_CALLBACK;
