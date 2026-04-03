import postgres from "postgres";

let sqlInstance: postgres.Sql | null = null;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add your Neon connection string.");
  }

  if (!sqlInstance) {
    sqlInstance = postgres(connectionString, {
      ssl: "require",
    });
  }

  return sqlInstance;
}
