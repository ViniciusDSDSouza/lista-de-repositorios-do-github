import express from "express";
import cors from "cors";
import { FRONTEND_REDIRECT_INDEX } from "./config/env.js";

import { getRepos } from "./handlers/getRepos.js";
import { postRepos } from "./handlers/postRepos.js";
import { deleteRepos } from "./handlers/deleteRepos.js";
import { getAuthGithub } from "./handlers/getAuthGithub.js";
import { getAuthCallback } from "./handlers/getAuthCallback.js";

const app = express();
const port = 3000;

app.use(express.json());

// CORS para comunicação com FRONTEND
app.use(
  cors({
    origin: FRONTEND_REDIRECT_INDEX, // Permitir apenas o frontend
    methods: ["GET", "POST", "OPTIONS", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
  })
);

app.get("/auth/github", getAuthGithub);

app.get("/auth/callback", getAuthCallback);

app.get("/repos", getRepos);

app.post("/repos", postRepos);

app.delete("/repos/:owner/:repo", deleteRepos);

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
