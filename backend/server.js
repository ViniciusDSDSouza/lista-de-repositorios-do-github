import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import jwt from "jsonwebtoken";

dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const FRONTEND_REDIRECT_DASHBOARD = process.env.FRONTEND_REDIRECT_DASHBOARD;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_JWT_SECRET_KEY = process.env.GITHUB_JWT_SECRET_KEY;
const CALLBACK_ENDPOINT = process.env.CALLBACK_ENDPOINT;
const GITHUB_AUTH_URL = process.env.GITHUB_AUTH_URL;

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "https://bookish-guacamole-9rxx6x766x5c49r-5173.app.github.dev",
    methods: ["GET", "POST"],
  })
);

// Redireciona para login do GitHub
app.get("/auth/github", (req, res) => {
  const githubAuthUrl = `${GITHUB_AUTH_URL}client_id=${GITHUB_CLIENT_ID}&redirect_uri=${CALLBACK_ENDPOINT}&scope=user`;
  res.redirect(githubAuthUrl);
});

app.get("/auth/callback", async (req, res) => {
  // Armazena o [code] --> query params
  const { code } = req.query;
  if (!code) {
    return res
      .status(400)
      .send("Não foi possível encontrar o parâmetro [code]");
  }

  try {
    // Consome API do github
    // Req http para trocar [code] por [acess_token]
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code: code,
          redirect_url: FRONTEND_REDIRECT_DASHBOARD,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = response.data;

    if (!access_token) {
      return res
        .status(400)
        .send("Não foi possível encontrar o token de acesso");
    }

    // acess_token --> JWT
    const payload = { access_token };
    const secretKey = GITHUB_JWT_SECRET_KEY || "sua-chave-secreta";
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    // Redireciona para outra página frontend
    const frontendRedirectUrl =
      "https://bookish-guacamole-9rxx6x766x5c49r-5173.app.github.dev/dashboard";
    res.redirect(`${frontendRedirectUrl}?jwt=${token}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro durante callback Github OAuth");
  }
});

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
