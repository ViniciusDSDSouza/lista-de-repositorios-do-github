import React, { useState, useEffect } from "react";
import axios from "axios";

function Repositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("jwt");

    if (!token) {
      console.error("Token JWT não encontrado!");
      return;
    }

    // Função para buscar repositórios
    const fetchRepos = async () => {
      try {
        const response = await axios.get(
          "https://bookish-guacamole-9rxx6x766x5c49r-3000.app.github.dev/repos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              username: "ViniciusDSDSouza",
              sort: "stars",
              page: 1,
            },
          }
        );

        setRepos(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) {
    return <div>Carregando Repositórios</div>;
  }

  return (
    <div>
      <h2>Meus Repositórios</h2>
      <ul>
        {repos.map((repo) => {
          return (
            <li key={repo.id}>
              <a href={repo.html_url} target="_blank">
                {repo.name}
              </a>
              <p>{repo.description || "Sem descrição"}</p>
              <p>{repo.language}</p>
              <p>{repo.stargazers_count} estrelas</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Repositories;
