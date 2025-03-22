import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

function Repositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // Pega o valor de 'page' da query string
        const queryParams = new URLSearchParams(location.search);
        const page = queryParams.get("page") || 1; // Pega o valor de 'page', se não tiver, usa 1

        const token = Cookies.get("jwt");

        if (!token) {
          console.log("JWT não encontrado [fetchRepos]");
        }

        const response = await axios.get("http://localhost:3000/repos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            username: "ViniciusDSDSouza",
            sort: "stars",
            page: page, // Usando o valor de 'page' da URL
          },
        });

        setRepos(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [location.search]); // Quando a URL (ou os query params) mudar, o efeito é re-executado

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
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
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
