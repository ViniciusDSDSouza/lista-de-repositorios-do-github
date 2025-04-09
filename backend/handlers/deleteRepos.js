import axios from "axios";

export const deleteRepos = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { owner, repo } = req.params;

  if (!token) {
    return res.status(401).send("Token de autenticação ausente.");
  }

  try {
    await axios.delete(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.status(200).json({ message: "Repositório deletado com sucesso!" });
  } catch (error) {
    console.error(
      "Erro ao deletar repositório:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Erro ao deletar repositório." });
  }
};
