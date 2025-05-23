import axios from "axios";
import { GITHUB_CREATE_REPO_URL } from "../config/env.js";

export const postRepos = async (req, res) => {
  const { name, description, isPrivate } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!name) {
    return res.status(400).send("O nome do repositoório é obrigatório.");
  }

  if (!token) {
    return res.status(401).send("Token de autenticação não encontrado.");
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
          Accept: "application/vnd.github+json",
        },
      }
    );

    res.json(response.data);
    console.log(response.data);
  } catch (err) {
    console.error(err);

    if (err.response?.status === 422) {
      return res.status(422).send("Repositório já existe.");
    }

    res.status(500).send("Erro ao criar o repositório no Github.");
  }
};
