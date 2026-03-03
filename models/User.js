const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, unique: true, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { 
  type: DataTypes.ENUM("client", "admin", "administrador", "vendedor", "soporte"), 
  defaultValue: "client" 
},
  seller_code: { type: DataTypes.STRING, allowNull: true }
});

module.exports = User;
