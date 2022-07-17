import { MySqlDatabase } from "./Db.controller.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const localhostVM = "192.168.1.10:8081";
const dbConnection = MySqlDatabase.connection();

const UserController = {
  addNewUser: (req, res) => {
    dbConnection.getConnection((error, connection) => {
      if (error) {
        return res.status(500).send({ error });
      }

      const verificationQuery = `SELECT * FROM users WHERE email = "${req.body.email}";`;
      connection.query(verificationQuery, (error, result, fields) => {
        if (error) {
          new Error({ message: "Something went wrong", error });
          return res.status(500).send({ error });
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
            connection.query(query, (error, result, fields) => {
              connection.release();

              if (error) {
                new Error({ message: "Something went wrong", error });
                return res.status(500).send({ error, response: null });
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

  showAllUsers: async (req, res) => {
    try {
      const query = `SELECT * FROM users;`;
      const result = await MySqlDatabase.execute(query);

      // Documented return of api
      const response = {
        message: "All users returned",
        total_of_users: result.length,
        users: result.map((user) => {
          return {
            user_id: user.ID,
            username: user.name,
            email: user.email,
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
    } catch (error) {
      res.status(500).send({ error });
    }
  },

  showUserById: async (req, res) => {
    try {
      const query = `SELECT * FROM users WHERE ID = ${req.params.id_user};`;
      const result = await MySqlDatabase.execute(query);

      if (result.length === 0) {
        return res.status(404).send({ Message: "Not found." });
      }
      const response = {
        message: `User found with id ${req.params.id_user}`,
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
    } catch (error) {
      return res.status(500).send({ error, response: null });
    }
  },

  updateUsername: async (req, res) => {
    try {
      const query = `UPDATE users SET name = "${req.body.new_user_name}"
                      WHERE ID = ${req.body.user_id};`;
      const result = await MySqlDatabase.execute(query);

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
    } catch (error) {
      return res.status(500).send({ error });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const hashPasswd = bcrypt.hashSync(req.body.password, 10);

      const query = `UPDATE users SET passwd = "${hashPasswd}"
                    WHERE ID = ${req.body.user_id};`;

      const result = MySqlDatabase.execute(query);

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
    } catch (error) {
      return res.status(500).send({ error, response: null });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const query = `DELETE FROM users WHERE ID = ${req.body.user_id}`;
      const result = await MySqlDatabase.execute(query);

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
    } catch (error) {
      return res.status(500).send({ error, response: null });
    }
  },

  login: async (req, res) => {
    try {
      const query = `SELECT * FROM users WHERE email = "${req.body.email}";`;
      const result = await MySqlDatabase.execute(query);

      if (result.length < 1) {
        return res.status(401).send({ message: "Login fail!" });
      }

      bcrypt.compare(
        req.body.password,
        result[0].passwd,
        (error, hashResult) => {
          if (error) {
            return res.status(401).send({ message: "Login fail!" });
          }
          console.log(result);
          if (hashResult) {
            let token = jwt.sign(
              {
                user_id: result[0].ID,
                email: result[0].email,
              },
              process.env.MYSQL_JWT_PRIVATE_KEY,
              {
                expiresIn: "1h",
              }
            );
            return res
              .status(200)
              .send({ message: "Login successfully.", token });
          }
          return res.status(401).send({ message: "Login fail!" });
        }
      );
    } catch (error) {
      return res.status(500).send(error);
    }
  },
};

export { UserController };
