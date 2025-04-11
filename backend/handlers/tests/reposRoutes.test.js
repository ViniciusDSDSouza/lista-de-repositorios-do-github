import request from "supertest";
import app from "../app.js";

describe("Repos API", () => {
  describe("GET /repos", () => {
    it("should return 400 if no username is provided", async () => {
      const response = await request(app).get("/repos");
      expect(response.status).toBe(400);
      expect(response.text).toBe("Parâmetro [username] ausente");
    });
  });

  describe("POST /repos", () => {
    it("should return 401 if no token is provided", async () => {
      const response = await request(app).post("/repos").send({
        name: "repo-teste",
        description: "test repo",
        isPrivate: false,
      });

      expect(response.status).toBe(401);
      expect(response.text).toBe("Token de autenticação não encontrado.");
    });
  });

  describe("DELETE /repos/:repoName", () => {
    it("should return 401 if no token is provided", async () => {
      const response = await request(app).delete("/repos/:owner/:repo");
      expect(response.status).toBe(401);
      expect(response.text).toBe("Token de autenticação ausente.");
    });
  });
});
