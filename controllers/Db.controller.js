import mysql2 from "mysql2";

const MySqlDatabase = {
  connection: () => {
    const dbInfo = {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
    };

    const connectedSession = mysql2.createPool(dbInfo);

    return connectedSession;
  },

  execute: (query) => {
    return new Promise((resolve, reject) => {
      const connection = MySqlDatabase.connection();

      connection.getConnection((error, connection) => {
        if (error) {
          reject(error);
        } else {
          connection.query(query, (error, result, field) => {
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

export { MySqlDatabase };
