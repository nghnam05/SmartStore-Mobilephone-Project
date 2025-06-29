import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const getConnect = async () => {
  const connection = await mysql.createConnection(
    process.env.DATABASE_URL as string
  );
  return connection;
  // const connection = await mysql.createConnection({
  //   port: 3306,
  //   host: "localhost",
  //   user: "root",
  //   password: "123456",
  //   database: "userdashboard",
  // });
  // return connection;
};

export default getConnect;
