const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/auth.routes")); // Login y registro
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/clients", require("./routes/client.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/commissions", require("./routes/commission.routes"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api", require("./routes/config.routes")); // Configuración y BCV

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Base de datos conectada");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Servidor corriendo en puerto " + (process.env.PORT || 5000));
    });
  })
  .catch(err => console.log(err));
