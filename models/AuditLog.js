const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AuditLog = sequelize.define("AuditLog", {
  action: DataTypes.STRING,
  details: DataTypes.TEXT,
  ip_address: DataTypes.STRING
});

module.exports = AuditLog;