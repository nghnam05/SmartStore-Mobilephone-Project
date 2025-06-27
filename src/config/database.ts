import mysql from "mysql2/promise";

const getConnect = async () => {
  const connection = await mysql.createConnection({
    port: 3306,
    host: "localhost",
    user: "root",
    password: "123456",
    database: "userdashboard",
  });
  return connection;
};

export default getConnect;
