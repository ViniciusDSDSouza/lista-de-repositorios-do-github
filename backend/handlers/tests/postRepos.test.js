import { beforeEach, describe, expect, jest } from "@jest/globals";

jest.unstable_mockModule("axios", () => ({
  default: {
    post: jest.fn(),
  },
}));

const axios = (await import("axios")).default;
const { postRepos } = await import("../postRepos.js");

describe("postRepos", () => {
  const req = {
    headers: { authorization: "Bearer fake-token" },
    body: {
      name: "new-repo",
      description: "repository description",
      isPrivate: false,
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks(); // limpa mocks anteriores antes de cada teste
  });

  it("post repository sucess", async () => {
    const mockData = { id: 1, name: "novo-repo" };
    axios.post.mockResolvedValue({ data: mockData });

    await postRepos(req, res);

    expect(axios.post).toHaveBeenCalledWith(
      "https://api.github.com/user/repos",
      {
        name: req.body.name,
        description: req.body.description,
        private: req.body.isPrivate,
      },
      {
        headers: {
          Authorization: "Bearer fake-token",
          Accept: "application/vnd.github+json",
        },
      }
    );

    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("post repository fail", async () => {
    axios.post.mockRejectedValue(new Error("Erro"));

    await postRepos(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      "Erro ao criar o repositório no Github."
    );
  });

  it("should return 422 if repository name already exists", async () => {
    // Simula um erro 422 vindo da API do GitHub
    axios.post.mockRejectedValue({
      response: {
        status: 422,
        data: {
          message: "Repository creation failed: name already exists",
        },
      },
    });

    await postRepos(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.send).toHaveBeenCalledWith("Repositório já existe.");
  });
});
