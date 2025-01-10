import database from "../../../../infra/database";


async function status(request, response) {
  const result = await database.query("SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = 'postgres';");
  response.status(200).json({ status: "OK" })
}

export default status;
