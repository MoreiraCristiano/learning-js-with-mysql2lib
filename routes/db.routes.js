import Router from "express";
import { db } from "../controller/db.controller.js";

const router = Router();
const dbConnection = db.connection();

// POST's
router.post("/add-new-user", (req, res) => {
  dbConnection.getConnection((error, connection) => {
    if (error) {
      return res.status(500).send({ error });
    }

    const query = `INSERT INTO users(name) VALUES("${req.body.username}");`;
    connection.query(query, (err, results, fields) => {
      connection.release();

      if (err) {
        new Error({ message: "Something went wrong", err });
        return res.status(500).send({ err, response: null });
      }

      res.status(201).send({ message: "New user has been created!", results });
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
    connection.execute(query, (err, results, fields) => {
      connection.release();

      if (err) {
        new Error({ message: "Something went wrong", err });
        return res.status(500).send({ err, response: null });
      }

      res.status(200).send({ message: "Success", results });
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

      res.status(200).send({ message: "Success", result });
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

    connection.query(query, (err, results, fields) => {
      connection.release();

      if (err) {
        return res.status(500).send({ err, response: null });
      }

      res.status(202).send({ message: "Username changed!", results });
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
    connection.query(query, (err, results, fields) => {
      connection.release();

      if (err) {
        new Error("Something went wrong");
        return res.status(500).send({ err, response: null });
      }

      res
        .status(202)
        .send({
          message: "Username deleted!",
          id_user: req.body.user_id,
          results,
        });
    });
  });
});
export { router };
