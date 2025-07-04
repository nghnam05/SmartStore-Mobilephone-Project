// import mysql from "mysql2/promise";

// const getConnect = async () => {
//   const connection = await mysql.createConnection({
//     port: 3306,
//     host: "localhost",
//     user: "root",
//     password: "123456",
//     database: "userdashboard",
//   });
//   return connection;
// };

// export default getConnect;

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const getConnect = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  console.log("✅ DB connected!");
  return connection;
};

export default getConnect;
