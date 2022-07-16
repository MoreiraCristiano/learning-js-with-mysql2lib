import { db } from "./db.controller.js";
import bcrypt from "bcrypt";

const dbConnection = db.connection();
const localhostVM = "192.168.1.4:8081";

const UserController = {
  addNewUser: (req, res) => {
    dbConnection.getConnection((error, connection) => {
      if (error) {
        return res.status(500).send({ error });
      }

      const verificationQuery = `SELECT * FROM users WHERE email = "${req.body.email}";`;
      connection.query(verificationQuery, (err, result, fields) => {
        if (err) {
          new Error({ message: "Something went wrong", err });
          return res.status(500).send({ err });
        }

        if (result.length > 0) {
          return res.status(409).send({ message: `User already exists.` });
        } else {
          bcrypt.hash(req.body.password, 10, (errBcrypt, hashPasswd) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt });
            }

            const query = `INSERT INTO users(name, email, passwd) 
                  VALUES("${req.body.username}", "${req.body.email}", "${hashPasswd}");`;
            connection.query(query, (err, result, fields) => {
              connection.release();

              if (err) {
                new Error({ message: "Something went wrong", err });
                return res.status(500).send({ err, response: null });
              }

              const response = {
                message: "New user has been created!",
                user_id: result.insertId, // Takes the id
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
              };

              res.status(201).send(response);
            });
          });
        }
      });
    });
  },

  showAllUsers: (req, res) => {
    dbConnection.getConnection((error, connection) => {
      if (error) {
        return res.status(500).send({ error });
      }

      const query = `SELECT * FROM users;`;
      connection.execute(query, (err, result, fields) => {
        connection.release();

        if (err) {
          new Error({ message: "Something went wrong", err });
          return res.status(500).send({ err, response: null });
        }

        // Documented return of api
        const response = {
          message: "All users returned",
          total_of_users: result.length,
          users: result.map((user) => {
            return {
              user_id: user.ID,
              username: user.name,
              hash_password: user.passwd,
              request: {
                type: "GET",
                description:
                  "To see only this specific user, use the follow endpoint.",
                url: `http://${localhostVM}/show-user/${user.ID}`,
              },
            };
          }),
        };

        res.status(200).send(response);
      });
    });
  },

  showUserById: (req, res) => {
    dbConnection.getConnection((error, connection) => {
      if (error) {
        new Error("Something went wrong");
        res.status(500).send({ err, response: null });
      }

      const query = `SELECT * FROM users WHERE ID = ${req.params.id_user};`;
      connection.query(query, (err, result, fields) => {
        connection.release();

        if (err) {
          new Error("Somenthing went wrong");
          return res.status(500).send({ err, response: null });
        }

        if (result.length === 0) {
          return res.status(404).send({ Message: "Not found." });
        }

        const response = {
          message: `User founded with id ${req.params.id_user}`,
          user: {
            user_id: result[0].ID,
            username: result[0].name,
            email: result[0].email,
            request: {
              type: "GET",
              description: "To see all users use the follow endpoint",
              url: `http://${localhostVM}/show-all-users`,
            },
          },
        };

        res.status(200).send(response);
      });
    });
  },

  updateUsername: (req, res) => {
    dbConnection.getConnection((error, connection) => {
      if (error) {
        new Error("Something went wrong");
        return res.status(500).send({ err, response: null });
      }

      const query = `UPDATE users SET name = "${req.body.new_user_name}"
                     WHERE ID = ${req.body.user_id};`;

      connection.query(query, (err, result, fields) => {
        connection.release();

        if (err) {
          return res.status(500).send({ err, response: null });
        }

        const response = {
          message: "Username changed!",
          changed_user: {
            user_id: req.body.user_id,
            name: req.body.new_user_name,
          },
          request: {
            type: "GET",
            description:
              "To see only this specific user, use the follow endpoint.",
            url: `http://${localhostVM}/show-user/${req.body.user_id}`,
          },
        };

        res.status(202).send(response);
      });
    });
  },

  updatePassword: (req, res) => {
    dbConnection.getConnection((error, connection) => {
      if (error) {
        new Error("Something went wrong");
        return res.status(500).send({ err, response: null });
      }

      const hashPasswd = bcrypt.hashSync(req.body.password, 10);

      const query = `UPDATE users SET passwd = "${hashPasswd}"
                     WHERE ID = ${req.body.user_id};`;

      connection.query(query, (err, result, fields) => {
        connection.release();

        if (err) {
          return res.status(500).send({ err, response: null });
        }

        const response = {
          message: "Password changed!",
          changed_user: {
            user_id: req.body.user_id,
          },
          request: {
            type: "GET",
            description:
              "To see only this specific user, use the follow endpoint.",
            url: `http://${localhostVM}/show-user/${req.body.user_id}`,
          },
        };

        res.status(202).send(response);
      });
    });
  },

  deleteUser: (req, res) => {
    dbConnection.getConnection((error, connection) => {
      if (error) {
        new Error("Something went wrong");
        return res.status(500).send({ err, response: null });
      }

      const query = `DELETE FROM users WHERE ID = ${req.body.user_id}`;
      connection.query(query, (err, result, fields) => {
        connection.release();

        if (err) {
          new Error("Something went wrong");
          return res.status(500).send({ err, response: null });
        }

        const response = {
          message: "User deleted!",
          id_user: req.body.user_id,
          request: {
            type: "POST",
            description: "To insert new user use the follow endpoint.",
            url: `${localhostVM}/add-new-user`,
            body: {
              username: "string",
              email: "string",
              password: "string",
            },
          },
        };

        res.status(202).send(response);
      });
    });
  },
};

export { UserController };
