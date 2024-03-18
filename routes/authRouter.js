import express from "express";
import authController from "../controllers/authController.js";
import authenticate from "../middlewares/authenticate.js";
import isValidBody from "../middlewares/isValidBody.js";
import validateBody from "../helpers/validateBody.js";
import { userLoginSchema, userRegisterSchema } from "../schemas/userSchema.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", isValidBody, validateBody(userRegisterSchema), authController.register);
authRouter.post("/login", isValidBody, validateBody(userLoginSchema), authController.login);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.get("/avatars", authenticate, authController.getAvatar);
authRouter.patch("/avatars", authenticate, upload.single("avatarURL"), authController.updateAvatar);
authRouter.get("/verify/:verificationToken", authController.verify);
authRouter.post("/verify", isValidBody, authController.resendVerify);

export default authRouter;
