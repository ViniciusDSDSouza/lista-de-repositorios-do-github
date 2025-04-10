import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.unstable_mockModule("../../config/env.js", () => ({
  GITHUB_PAT: "fake-pat",
}));

jest.unstable_mockModule("axios", () => ({
  default: {
    get: jest.fn(),
  },
}));

const axios = (await import("axios")).default;
const { getRepos } = await import("../getRepos.js");

describe("getRepos", () => {
  const req = {
    query: {
      username: "user",
      page: 2,
      sort: "created",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("get repositories success", async () => {
    const mockData = [
      { id: 1, name: "repo1" },
      { id: 2, name: "repo2" },
    ];
    axios.get.mockResolvedValue({ data: mockData });

    await getRepos(req, res);

    expect(axios.get).toHaveBeenCalledWith(
      "https://api.github.com/users/user/repos",
      {
        params: {
          page: 2,
          sort: "created",
          per_page: 10,
        },
        headers: {
          Authorization: "fake-pat",
        },
      }
    );

    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("get repositories fail", async () => {
    axios.get.mockRejectedValue(new Error("Erro"));

    await getRepos(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      "Erro ao buscar repositórios do Github"
    );
  });
});
