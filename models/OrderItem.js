const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define("OrderItem", {
  product_name: { type: DataTypes.STRING, defaultValue: '' },
  quantity: DataTypes.INTEGER,
  price: DataTypes.FLOAT
});

module.exports = OrderItem;
