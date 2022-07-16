import Router from "express";
import { db } from "../controller/db.controller.js";

const router = Router();
const dbConnection = db.connection();

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

      res.status(201).send({ message: `New user has been created!`, results });
    });
  });
});

router.get("/show-all-users", (req, res) => {
  dbConnection.getConnection((error, connection) => {
    connection.release();

    if (error) {
      return res.status(500).send({ error });
    }

    const query = `SELECT * FROM users;`;
    connection.execute(query, (err, results, fields) => {
      if (err) {
        new Error({ message: "Something went wrong", err });
        return res.status(500).send({ err, response: null });
      }

      res.status(200).json(results);
    });
  });
});

router.get("/show-user/:id_user", (req, res) => {
  dbConnection.getConnection((error, connection) => {
    connection.release();

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

      res.status(200).json(result);
    });
  });
});

export { router };
