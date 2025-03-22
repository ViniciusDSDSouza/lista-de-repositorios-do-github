import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function CreateRepository() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateRepo = async () => {
    const token = Cookies.get("jwt");
    const access_token = Cookies.get("access_token");

    if (!token) {
      window.alert("Você precisa estar autenticado");
      return;
    }

    const repoData = {
      name,
      description,
      private: isPrivate,
    };

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/repos",
        repoData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`, // Adicionando o token JWT no header
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Repositório criado com sucesso: ", response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Criar Repositório</h2>
      <input
        type="text"
        placeholder="Nome do repositório"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Descrição do repositório"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={() => setIsPrivate(!isPrivate)}
        />
        Repositório privado
      </label>
      <button onClick={handleCreateRepo} disabled={loading}>
        {loading ? "Criando..." : "Criar Repositório"}
      </button>
    </div>
  );
}

export default CreateRepository;
