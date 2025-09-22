import path from "path";
import fs from "fs/promises";
import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import { getAvatarUrl } from "../helpers/avatar.js";
import { createToken } from "../helpers/jwt.js";

const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const newUser = await authServices.saveUser(req.body);

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
  register,
  login,
  getCurrentUser,
  logout,
  updateAvatar,
};
