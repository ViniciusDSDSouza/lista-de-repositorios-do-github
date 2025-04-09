import axios from "axios";
import { GITHUB_PAT } from "../config/env.js";

export const getRepos = async (req, res) => {
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
};
