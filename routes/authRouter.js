import express from "express";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../middlewares/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import {
  registerAuthSchema,
  loginAuthSchema,
  authEmailSchema,
} from "../schemas/authSchemas.js";
import authControllers from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(registerAuthSchema),
  authControllers.register
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(loginAuthSchema),
  authControllers.login
);

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post(
  "/verify",
  isEmptyBody,
  validateBody(authEmailSchema),
  authControllers.resendVerify
);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.get("/current", authenticate, authControllers.getCurrentUser);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authControllers.updateAvatar
);

export default authRouter;
