import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

const app = express();
const port = 3000;

app.use(
  cors({
    origin: GITHUB_REDIRECT_URI,
    methods: ["GET", "POST"],
  })
);

// Redireciona para login do GitHub
app.get("/auth/github", (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user`;
  res.redirect(githubAuthUrl);
});

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
