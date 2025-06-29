import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const getConnect = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306), // ép kiểu về number
    ssl:
      process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  });

  return connection;
};
export default getConnect;

// const connection = await mysql.createConnection({
//   port: 3306,
//   host: "localhost",
//   user: "root",
//   password: "123456",
//   database: "userdashboard",
// });
