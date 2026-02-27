const sequelize = require("./config/database");
const { User, Product } = require("./models");
const bcrypt = require("bcryptjs");

const seedDatabase = async () => {
  try {
    console.log("🔄 Conectando a la base de datos...");
    // force: true BORRA todas las tablas y las vuelve a crear
    await sequelize.sync({ force: true });
    console.log("✅ Base de datos reiniciada");

    // --- 1. Crear Usuario Admin ---
    const adminPassword = await bcrypt.hash("admin", 10);
    await User.create({
      name: "Administrador",
      email: "admin@admin.com",
      password: adminPassword,
      role: "admin"
    });
    console.log("👤 Admin creado: admin@admin.com / admin");

    // --- 2. Crear Usuario Cliente ---
    const clientPassword = await bcrypt.hash("123456", 10);
    await User.create({
      name: "Cliente de Prueba",
      email: "cliente@test.com",
      password: clientPassword,
      role: "client"
    });
    console.log("👤 Cliente creado: cliente@test.com / 123456");

    // --- 3. Crear Productos ---
    const products = [
      {
        name: "Laptop Gamer Pro",
        description: "Laptop de alto rendimiento con tarjeta gráfica dedicada, ideal para juegos y diseño.",
        price: 1250.00,
        stock: 10,
        image: "https://via.placeholder.com/300?text=Laptop"
      },
      {
        name: "Smartphone X",
        description: "Teléfono inteligente de última generación con cámara de 108MP.",
        price: 899.99,
        stock: 25,
        image: "https://via.placeholder.com/300?text=Smartphone"
      },
      {
        name: "Auriculares Bluetooth",
        description: "Auriculares inalámbricos con cancelación de ruido activa.",
        price: 59.99,
        stock: 50,
        image: "https://via.placeholder.com/300?text=Auriculares"
      },
      {
        name: "Monitor 4K Ultra",
        description: "Monitor de 27 pulgadas con resolución 4K UHD para una experiencia visual inmersiva.",
        price: 350.00,
        stock: 15,
        image: "https://via.placeholder.com/300?text=Monitor"
      },
      {
        name: "Teclado Mecánico RGB",
        description: "Teclado mecánico para gamers con iluminación RGB personalizable.",
        price: 85.00,
        stock: 40,
        image: "https://via.placeholder.com/300?text=Teclado"
      }
    ];

    await Product.bulkCreate(products);
    console.log(`📦 ${products.length} productos creados`);

    console.log("🚀 Seed completado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al ejecutar el seed:", error);
    process.exit(1);
  }
};

seedDatabase();