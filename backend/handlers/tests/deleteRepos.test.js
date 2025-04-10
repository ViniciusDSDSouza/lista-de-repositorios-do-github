import { describe, expect, jest } from "@jest/globals";

jest.unstable_mockModule("axios", () => ({
  default: {
    delete: jest.fn(),
  },
}));

const axios = (await import("axios")).default;
const { deleteRepos } = await import("../deleteRepos.js");

describe("deleteRepos", () => {
  const req = {
    headers: { authorization: "Bearer fake-token" },
    params: { owner: "vinicius", repo: "teste-repo" },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  it("delete repository sucesss", async () => {
    axios.delete.mockResolvedValue({}); // simula resposta sucesso

    await deleteRepos(req, res);

    expect(axios.delete).toHaveBeenCalledWith(
      "https://api.github.com/repos/vinicius/teste-repo",
      { headers: { Authorization: "Bearer fake-token" } }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Repositório deletado com sucesso!",
    });
  });

  it("delete repository fail", async () => {
    axios.delete.mockRejectedValue(new Error("Erro de API")); // simula resposta de erro

    await deleteRepos(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erro ao deletar repositório.",
    });
  });
});
