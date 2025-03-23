import React from "react";
import { Link } from "react-router-dom";
import style from "../styles/Navigation.module.css";

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/repos?username=ViniciusDSDSouza&sort=stars&page=1">
            Repositórios
          </Link>
        </li>
        <li>
          <Link to="/create-repo">Criar Repositório</Link>
        </li>
        <li>
          <Link to="/repo-search">Pesquisar Repositórios</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
