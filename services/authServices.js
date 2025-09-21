import bcrypt from "bcrypt";

import { User } from "../db/User.js";

export const findUser = async (filter) => User.findOne({ where: filter });

export const saveUser = async (data) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const updateUser = async (filter, data) => {
  const user = await findUser(filter);
  if (user) {
    await user.update(data);
    await user.save();
  }
  return user;
};
