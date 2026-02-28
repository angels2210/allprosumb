const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.FLOAT,
  stock: DataTypes.INTEGER,
  image_url: { type: DataTypes.STRING, allowNull: true },
  category_id: { type: DataTypes.INTEGER, allowNull: true }
});

module.exports = Product;