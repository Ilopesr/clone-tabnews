import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { InternalServerError, MethodNotAllowedError } from "@/infra/errors";

const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

async function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.status_code).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.error("\nErro dentro do catch do next-connect:", error);
  response.status(500).json(publicErrorObject);
}

function getMigrationOptions(dbClient, dryRun = true) {
  return {
    dbClient,
    dryRun,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
}

async function withDatabaseClient(handler) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    return await handler(dbClient);
  } finally {
    if (dbClient) {
      await dbClient?.end();
    }
  }
}

async function getHandler(request, response) {
  await withDatabaseClient(async (dbClient) => {
    const pendingMigrations = await migrationRunner(
      getMigrationOptions(dbClient),
    );
    response.status(200).json(pendingMigrations);
  });
}

async function postHandler(request, response) {
  await withDatabaseClient(async (dbClient) => {
    const migratedMigrations = await migrationRunner({
      ...getMigrationOptions(dbClient, false),
    });

    const statusCode = migratedMigrations.length > 0 ? 201 : 200;
    response.status(statusCode).json(migratedMigrations);
  });
}
