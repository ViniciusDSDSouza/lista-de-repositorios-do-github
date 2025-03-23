import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";

function RepoSearch() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const usernameFromUrl = queryParams.get("username") || "";
        const pageFromUrl = parseInt(queryParams.get("page")) || 1;

        setUsername(usernameFromUrl);
        setPage(pageFromUrl);

        if (!usernameFromUrl) return;

        setLoading(true);

        const response = await axios.get(
          `https://api.github.com/users/${usernameFromUrl}/repos`,
          {
            params: {
              page: pageFromUrl,
              per_page: 10,
            },
          }
        );

        setRepos(response.data);
      } catch (error) {
        console.error("Erro ao buscar repositórios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [location.search]); // Quando a URL muda, recarrega os repositórios

  const handleSearch = () => {
    navigate(`/repo-search?username=${username}&page=1`);
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      navigate(`/repo-search?username=${username}&page=${page - 1}`);
    }
  };

  const goToNextPage = () => {
    navigate(`/repo-search?username=${username}&page=${page + 1}`);
  };

  return (
    <div>
      <header>
        <Navigation />
      </header>
      <main className="repo-search">
        <h2>Pesquisar Repositórios do GitHub</h2>
        <input
          type="text"
          placeholder="Digite o nome do usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Carregando..." : "Pesquisar"}
        </button>

        {repos.length > 0 && (
          <>
            <ul>
              {repos.map((repo) => (
                <li key={repo.id}>
                  <h3>{repo.name}</h3>
                  <p>{repo.description || "Sem descrição"}</p>
                  <p>Estrelas: {repo.stargazers_count}</p>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Acessar Repositório no GitHub
                  </a>
                </li>
              ))}
            </ul>

            <div>
              {page > 1 && (
                <button onClick={goToPreviousPage}>Página Anterior</button>
              )}
              <span>Página {page}</span>
              <button onClick={goToNextPage}>Próxima Página</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default RepoSearch;
