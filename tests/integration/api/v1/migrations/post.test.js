import database from "infra/database";

async function runMigrations() {
  await database.query("DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC;");
}

beforeAll(async () => {
  await runMigrations();
});

test("POST /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
  });
  expect(response.status).toBe(201);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  const responseTwo = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
  });
  expect(responseTwo.status).toBe(200);

  const responseTwoBody = await responseTwo.json();

  expect(Array.isArray(responseTwoBody)).toBe(true);
  expect(responseTwoBody.length).toBe(0);
});

test("DELETE /api/v1/migrations should return 405", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  });
  expect(response.status).toBe(405);
});
