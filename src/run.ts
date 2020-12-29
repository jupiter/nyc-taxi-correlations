import { Connection, DuckDB } from "node-duckdb";

const run = async () => {
  const db = new DuckDB();
  const connection = new Connection(db);
  const result = await connection.executeIterator(
    "SELECT * FROM read_csv_auto('data/yellow_tripdata_2019-01.csv')"
  );
  console.log(result.fetchRow());
};

run().catch(console.error);
