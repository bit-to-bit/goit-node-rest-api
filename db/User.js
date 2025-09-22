import { sequelize } from "./sequelize.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  subscription: {
    type: DataTypes.ENUM,
    values: ["starter", "pro", "business"],
    defaultValue: "starter",
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  avatarURL: { type: DataTypes.STRING },
});

User.sync()
  .then(() => {
    console.log("Database object users successfully updated");
  })
  .catch((error) => {
    console.log(error.message);
  });
