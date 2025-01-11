import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";
export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  const dbClient = await database.getNewClient();

  if (!allowedMethods.includes(request.method)) {
    response.status(405).end();
    return;
  }

  const migrationsDefaultOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(migrationsDefaultOptions);
    await dbClient.end();
    response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...migrationsDefaultOptions,
      dryRun: false,
    });

    await dbClient.end();

    if (migratedMigrations.length > 0) {
      response.status(201).json(migratedMigrations);
    }
    response.status(200).json(migratedMigrations);
  }

  dbClient.end();
}
