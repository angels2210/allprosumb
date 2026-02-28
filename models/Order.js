const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("Order", {
  customer_name: { type: DataTypes.STRING, defaultValue: '' },
  customer_phone: { type: DataTypes.STRING, defaultValue: '' },
  customer_id_number: { type: DataTypes.STRING, defaultValue: '' },
  customer_id_type: { type: DataTypes.STRING, defaultValue: 'V' },
  business_name: { type: DataTypes.STRING, defaultValue: '' },
  address: { type: DataTypes.STRING, defaultValue: '' },
  manager_name: { type: DataTypes.STRING, defaultValue: '' },
  seller_name_code: { type: DataTypes.STRING, defaultValue: '' },
  total: { type: DataTypes.FLOAT, defaultValue: 0 },
  payment_method: { type: DataTypes.STRING, defaultValue: 'contado' },
  payment_reference: { type: DataTypes.STRING, defaultValue: '' },
  payment_receipt: { type: DataTypes.STRING, defaultValue: '' },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  credit_days: { type: DataTypes.INTEGER, defaultValue: 0 },
  apply_discount: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Order;
