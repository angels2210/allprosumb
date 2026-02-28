const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("client", "admin", "vendedor"), defaultValue: "client" },
  seller_code: { type: DataTypes.STRING, allowNull: true }
});

module.exports = User;
