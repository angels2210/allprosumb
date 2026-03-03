const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Message = require("./Message");
const Setting = require("./Setting");
const AuditLog = require("./AuditLog");

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

User.hasMany(Message);
Message.belongsTo(User);

Product.belongsTo(Category);
Category.hasMany(Product);

User.hasMany(AuditLog);
AuditLog.belongsTo(User);

module.exports = { User, Product, Order, OrderItem, Message, Category, Setting, AuditLog };
