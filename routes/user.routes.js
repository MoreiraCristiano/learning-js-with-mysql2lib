import Router from "express";
import bcrypt from "bcrypt";
import { db } from "../controllers/db.controller.js";
import { UserController } from "../controllers/users.controller.js";

const router = Router();
const dbConnection = db.connection();
const localhostVM = "192.168.1.4:8081";

// POST's
router.post("/add-new-user", UserController.addNewUser);

// GET's
router.get("/show-all-users", UserController.showAllUsers);

router.get("/show-user/:id_user", UserController.showUserById);

// PATCH's
router.patch("/update-username", UserController.updateUsername);

router.patch("/update-password", UserController.updatePassword);

// DELETE
router.delete("/delete-user", UserController.deleteUser);
export { router };
