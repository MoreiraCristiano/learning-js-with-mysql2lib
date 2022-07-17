import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { router } from "./routes/user.routes.js";

const port = 8081;
const app = express();

// Accepts only simple data
app.use(bodyParser.urlencoded({ extended: false }));

// Accepts only json as body
// app.use(bodyParser.json()); <- Old method
app.use(express.json());

// Some access control
app.use(cors());

// Allow to access the api definitions
// The second parameter defines who have permission to access the api(like a specific server)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, Content-Type, X-Requested-With, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    return res.status(200).send({});
  }
  next();
});

/**
 * All user routes and their methods
 */
// GET
app.get("/show-all-users", router);
app.get("/show-user/:id_user", router);

// POST
app.post("/add-new-user", router);
app.post("/login", router);

// PATCH
app.patch("/update-username", router);
app.patch("/update-password", router);

// DELETE
app.delete("/delete-user", router);

// Error catch for non founded routes
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
