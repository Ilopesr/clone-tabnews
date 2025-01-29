import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitingForAllServices();
  await orchestrator.clearDatabase();
});

describe("DELETE api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Only accept GET and POST", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        action:
          "Verifique se o método HTTP enviado é válido para este endpoint",
        message: "Método não permitido para este endpoint",
        name: "MethodNotAllowedError",
        status_code: 405,
      });
    });
  });
});
