const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define("OrderItem", {
  quantity: DataTypes.INTEGER,
  price: DataTypes.FLOAT
});

module.exports = OrderItem;
