import express from "express";
import cors from "cors";
import { FRONTEND_REDIRECT_INDEX } from "../config/env.js";

import { getRepos } from "../handlers/getRepos.js";
import { postRepos } from "../handlers/postRepos.js";
import { deleteRepos } from "../handlers/deleteRepos.js";
import { getAuthGithub } from "../handlers/getAuthGithub.js";
import { getAuthCallback } from "../handlers/getAuthCallback.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_REDIRECT_INDEX,
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/auth/github", getAuthGithub);
app.get("/auth/callback", getAuthCallback);
app.get("/repos", getRepos);
app.post("/repos", postRepos);
app.delete("/repos/:owner/:repo", deleteRepos);

export default app;
