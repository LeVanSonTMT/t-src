import express from "express";

import authController from "../controllers/authController";
import handleValidationErrors from "../middleware/handleValidationErrors";

import { validateChangePW, validateLogin } from "../validateRules";



const router = express.Router();

router.post("/login", validateLogin, handleValidationErrors, authController.login);

router.post("/refreshToken", authController.refreshToken);

router.post("/changePassword", validateChangePW, authController.changePassword);

export default router;
