import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";

function Repositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  const token = Cookies.get("jwt");
  const username = Cookies.get("username");

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const pageFromUrl = parseInt(queryParams.get("page")) || 1;
        setPage(pageFromUrl);

        if (!token) {
          console.log("JWT não encontrado [fetchRepos]");
        }

        if (!username) {
          console.log("Nome de usuário não encontrado!");
        }

        const response = await axios.get("http://localhost:3000/repos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            username: username,
            sort: "stars",
            page: pageFromUrl,
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

  const goToPreviousPage = () => {
    if (page > 1) {
      navigate(`/repos?username=${username}&sort=stars&page=${page - 1}`);
    }
  };

  // Função para ir para a próxima página
  const goToNextPage = () => {
    navigate(`/repos?username=${username}&sort=stars&page=${page + 1}`);
  };

  if (loading) {
    return <div>Carregando Repositórios</div>;
  }

  return (
    <div>
      <header>
        <Navigation />
      </header>
      <main className="repositories">
        <h2>Meus Repositórios</h2>
        <ul>
          {repos.map((repo) => (
            <li key={repo.id}>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
              <p>{repo.description || "Sem descrição"}</p>
              <p>{repo.language}</p>
              <p>{repo.stargazers_count} estrelas</p>
            </li>
          ))}
        </ul>
        <div>
          <button onClick={goToPreviousPage} disabled={page === 1}>
            Anterior
          </button>
          <span>Página {page}</span>
          <button onClick={goToNextPage}>Próxima</button>
        </div>
      </main>
    </div>
  );
}

export default Repositories;
