import { createRouter } from "next-connect";
import { InternalServerError, MethodNotAllowedError } from "@/infra/errors";
import database from "infra/database";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNonMatchHandler,
  onError: onErrorHandler,
});

function onNonMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();

  response.status(publicErrorObject.status_code).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.log("\nErro dentro do catch do next-connect.");
  console.log(error);

  response.status(500).json(publicErrorObject);
}

async function getHandler(request, response) {
  const updateAt = new Date().toISOString();

  const databaseVersion = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersion.rows[0];

  const maxConnections = await database.query("SHOW max_connections;");
  const maxConnectionsValue = await maxConnections.rows[0];

  const databaseName = process.env.POSTGRES_DB;

  const openedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const openedConnectionsValue = await openedConnections.rows[0];

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionValue.server_version,
        max_connections: parseInt(maxConnectionsValue.max_connections),
        opened_connections: openedConnectionsValue.count,
      },
    },
  });
}
