import { createUser, deleteUser, getUserById, getUsers, updateUser } from "./../controller/userController.js";
import { Router } from "express";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;