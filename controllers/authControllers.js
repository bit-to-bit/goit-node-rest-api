import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import { getAvatarUrl } from "../helpers/avatar.js";
import { createToken } from "../helpers/jwt.js";
import emailSender from "../helpers/emailSender.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const verificationToken = nanoid();

    const newUser = await authServices.saveUser({
      ...req.body,
      verificationToken,
    });

    const verifyEmail = emailSender.generateVerifyEmail(
      email,
      verificationToken
    );

    await emailSender.sendEmail(verifyEmail);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    const comparePassword = await compareHash(password, user.password);
    if (!comparePassword) {
      throw HttpError(401, "Email or password is wrong");
    }

    const { id } = user;
    const payload = { id };

    const token = createToken(payload);

    await authServices.updateUser({ id }, { token });

    res.json({
      token: token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({
    verificationToken,
  });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await authServices.updateUser(
    { id: user.id },
    { verify: true, verificationToken: null }
  );

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = emailSender.generateVerifyEmail(
    email,
    user.verificationToken
  );

  await emailSender.sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

const getCurrentUser = (req, res, next) => {
  try {
    const { email, subscription, avatarURL } = req.user;

    res.json({
      email,
      subscription,
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    await authServices.updateUser({ id }, { token: "" });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const { id } = req.user;
  const fileName = req.file.filename;
  const tempFilePath = req.file.path;
  const storageFilePath = path.resolve("public", "avatars", fileName);
  try {
    await fs.rename(tempFilePath, storageFilePath);
    const avatar = await getAvatarUrl(req.headers.host, fileName);
    const { avatarURL } = await authServices.updateUser(
      { id },
      { avatarURL: avatar }
    );
    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempFilePath);
    return next(error);
  }
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  resendVerify: ctrlWrapper(resendVerify),
  verify: ctrlWrapper(verify),
};
