import retry from "async-retry";
import database from "infra/database";
import migrator from "@/models/migrator";

async function waitingForAllServices() {
  await webForWebServer();

  async function webForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC;");
}

async function runPedingMigrations() {
  await migrator.runPendingMigrations();
}

const orchestrator = {
  waitingForAllServices,
  clearDatabase,
  runPedingMigrations,
};

export default orchestrator;
