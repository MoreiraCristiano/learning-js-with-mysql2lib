import mysql2 from "mysql2";

const db = {
  connection: () => {
    const dbInfo = {
      host: "localhost",
      user: "root",
      password: "Cristiano*01",
      database: "js_sql",
    };

    const connectedSession = mysql2.createPool(dbInfo);

    return connectedSession;
  },
};

export { db };
