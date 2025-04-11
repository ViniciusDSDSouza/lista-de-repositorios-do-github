import axios from "axios";
import jwt from "jsonwebtoken";
import {
  GITHUB_ACCESS_TOKKEN_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  FRONTEND_REDIRECT_REPOS,
  GITHUB_JWT_SECRET_KEY,
} from "../config/env.js";

export const getAuthCallback = async (req, res) => {
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
};
