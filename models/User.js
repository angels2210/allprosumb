const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: true },
  username: { type: DataTypes.STRING, unique: true, allowNull: true },
  first_name: { type: DataTypes.STRING, allowNull: true },
  last_name: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM("client", "admin", "administrador", "vendedor", "soporte"),
    defaultValue: "client"
  },
  seller_code: { type: DataTypes.STRING, allowNull: true }
});

module.exports = User;