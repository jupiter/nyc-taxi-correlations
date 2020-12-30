import { Connection, DuckDB } from "node-duckdb";

const run = async () => {
  console.time("run");
  const db = new DuckDB();
  const connection = new Connection(db);
  const r = (x: string, y: string) =>
    `covar_pop(${x}, ${y}) / (stddev_pop(${x}) * stddev_pop(${y}))`;
  const result = await connection.executeIterator(
    `SELECT extract('month' FROM tpep_pickup_datetime), count(), ${r(
      "tip_amount",
      "trip_distance"
    )} as tip_distance, ${r(
      "tip_amount",
      "total_amount - tip_amount"
    )} as tip_fare, ${r(
      "tip_amount",
      "passenger_count"
    )} as tip_passengers FROM (
      SELECT * FROM read_csv_auto('data/yellow_tripdata_2019-01.csv')
      UNION
      SELECT * FROM read_csv_auto('data/yellow_tripdata_2019-02.csv')
      UNION
      SELECT * FROM read_csv_auto('data/yellow_tripdata_2019-03.csv')
      UNION
      SELECT * FROM read_csv_auto('data/yellow_tripdata_2019-04.csv')
      UNION
      SELECT * FROM read_csv_auto('data/yellow_tripdata_2019-05.csv')
      UNION
      SELECT * FROM read_csv_auto('data/yellow_tripdata_2019-06.csv')
    ) as trips 
    WHERE extract('month' FROM tpep_pickup_datetime) < 7 
    GROUP BY extract('month' FROM tpep_pickup_datetime)`
  );
  console.log(result.fetchAllRows());
  console.timeEnd("run");
};

run().catch(console.error);
