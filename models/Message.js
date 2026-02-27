const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("Message", {
  content: DataTypes.TEXT,
  sender: DataTypes.STRING
});

module.exports = Message;
