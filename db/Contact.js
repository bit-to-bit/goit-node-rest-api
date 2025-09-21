import { sequelize } from "./sequelize.js";
import { DataTypes } from "sequelize";

export const Contact = sequelize.define("contact", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Contact.sync()
  .then(() => {
    console.log("Database object contacts successfully updated");
  })
  .catch((error) => {
    console.log(error.message);
  });
