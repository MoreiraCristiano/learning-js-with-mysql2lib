import Router from "express";
import { login } from "../middleware/login.middleware..js";
import { UserController } from "../controllers/Users.controller.js";

const router = Router();

// POST's
router.post("/add-new-user", UserController.addNewUser);
router.post("/login", UserController.login);

// GET's
router.get("/show-all-users", UserController.showAllUsers);
router.get("/show-user/:id_user", UserController.showUserById);

// PATCH's
router.patch("/update-username", UserController.updateUsername);
router.patch("/update-password", login.required, UserController.updatePassword);

// DELETE
router.delete("/delete-user", UserController.deleteUser);

export { router };
