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

  execute: (query, params = []) => {
    return new Promise((resolve, reject) => {
      const connection = db.connection();

      connection.getConnection((error, connection) => {
        if (error) {
          reject(error);
        } else {
          connection.query(query, params, (error, result, field) => {
            connection.release();

            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  },
};

export { db };
