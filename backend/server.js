import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import jwt from "jsonwebtoken";

dotenv.config();

// Variáveis do usuário
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_JWT_SECRET_KEY = process.env.GITHUB_JWT_SECRET_KEY;

// Variáveis da API Github
const GITHUB_AUTH_URL = process.env.GITHUB_AUTH_URL;
const GITHUB_ACCESS_TOKKEN_URL = process.env.GITHUB_ACCESS_TOKKEN_URL;
const GITHUB_CREATE_REPO_URL = process.env.GITHUB_CREATE_REPO_URL;
const GITHUB_PAT = process.env.GITHUB_PAT;

// Variáveis FRONTEND
const FRONTEND_REDIRECT_INDEX = process.env.FRONTEND_REDIRECT_INDEX;
const FRONTEND_REDIRECT_REPOS = process.env.FRONTEND_REDIRECT_REPOS;

// Variáveis BACKEND
const ENDPOINT_CALLBACK = process.env.ENDPOINT_CALLBACK;

const app = express();
const port = 3000;

app.use(express.json());

// CORS para comunicação com FRONTEND
app.use(
  cors({
    origin: FRONTEND_REDIRECT_INDEX, // Permitir apenas o frontend
    methods: ["GET", "POST", "OPTIONS"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
  })
);

// Endpoint autenticação GitHub
app.get("/auth/github", (req, res) => {
  const githubAuthUrl = `${GITHUB_AUTH_URL}client_id=${GITHUB_CLIENT_ID}&redirect_uri=${ENDPOINT_CALLBACK}&scope=repo`;
  res.redirect(githubAuthUrl);
});

// Endpoint JWT
app.get("/auth/callback", async (req, res) => {
  // Armazena o [code] --> query params
  const { code } = req.query;
  if (!code) {
    return res
      .status(400)
      .send("Não foi possível encontrar o parâmetro [code]");
  }

  // Tratamento de erro
  try {
    // AXIOS --> Consome API do github
    // Req http (post) para trocar [code] por [acess_token]
    const response = await axios.post(GITHUB_ACCESS_TOKKEN_URL, null, {
      params: {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
        redirect_url: FRONTEND_REDIRECT_REPOS,
      },
      headers: {
        Accept: "application/json",
      },
    });

    const { access_token } = response.data;

    if (!access_token) {
      return res
        .status(400)
        .send("Não foi possível encontrar o token de acesso");
    }

    res.cookie("access_token", access_token, {
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const username = userResponse.data.login;
    res.cookie("username", username, {
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    // acess_token --> JWT
    const payload = { access_token };
    const secretKey = GITHUB_JWT_SECRET_KEY || "sua-chave-secreta";
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    res.cookie("jwt", token, {
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    // Redireciona para repositórios
    const frontendRedirectUrl = `${FRONTEND_REDIRECT_REPOS}?username=${username}&sort=stars&page=1`;
    res.redirect(frontendRedirectUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro durante callback Github OAuth");
  }
});

// endpoint /repos
app.get("/repos", async (req, res) => {
  const { username, page = 1, sort } = req.query;

  if (!username) {
    return console.log("Parâmetro [username] ausente");
  }

  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        params: {
          page,
          sort,
          per_page: 10,
        },
        headers: {
          Authorization: GITHUB_PAT,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar repositórios do Github");
  }
});

app.post("/repos", async (req, res) => {
  const { name, description, isPrivate } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!name) {
    return res.status(400).send("O nome do repositoório é obrigatório.");
  }

  if (!token) {
    return res.status(400).send("Token de autenticação não encontrado.");
  }

  try {
    const response = await axios.post(
      GITHUB_CREATE_REPO_URL,
      {
        name,
        description,
        private: isPrivate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: GITHUB_PAT,
        },
      }
    );

    res.json(response.data);
    console.log(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao criar o repositório no Github.");
  }
});

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
