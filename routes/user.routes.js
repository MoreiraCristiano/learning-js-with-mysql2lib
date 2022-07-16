import Router from "express";
import bcrypt from "bcrypt";
import { db } from "../controller/db.controller.js";

const router = Router();
const dbConnection = db.connection();
const localhostVM = "192.168.1.4:8081";

// POST's
router.post("/add-new-user", (req, res) => {
  dbConnection.getConnection((error, connection) => {
    if (error) {
      return res.status(500).send({ error });
    }

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
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        };

        res.status(201).send(response);
      });
    });
  });
});

// GET's
router.get("/show-all-users", (req, res) => {
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
});

router.get("/show-user/:id_user", (req, res) => {
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
});

// PATCH's
router.patch("/update-username", (req, res) => {
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
});

router.patch("/update-password", (req, res) => {
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
});

// DELETE
router.delete("/delete-username", (req, res) => {
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
        message: "Username deleted!",
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
});
export { router };
