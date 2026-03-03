const sequelize = require("./config/database");
const bcrypt = require("bcryptjs");

const seedDatabase = async () => {
  try {
    console.log("🔄 Reiniciando base de datos...");
    
    // Eliminar ENUM viejo antes de sync
    await sequelize.query('DROP TYPE IF EXISTS "enum_Users_role" CASCADE');
    console.log("🗑️ ENUM eliminado");

    // Importar modelos DESPUÉS de eliminar el ENUM
    const { User, Product, Order, OrderItem, Message } = require("./models");
    
    await sequelize.sync({ force: true });
    console.log("✅ Base de datos reiniciada");

    const adminPassword = await bcrypt.hash("admin", 10);
    await User.create({ username: "admin", name: "Administrador", email: "admin@admin.com", password: adminPassword, role: "administrador", seller_code: null });
    console.log("👤 Admin: admin@admin.com / admin");

    const vendedor1Password = await bcrypt.hash("vendedor123", 10);
    await User.create({ username: "vendedor1", name: "Vendedor Uno", email: "vendedor1@allprosum.local", password: vendedor1Password, role: "vendedor", seller_code: "VEN-001" });
    console.log("👤 Vendedor: vendedor1 / vendedor123");

    const soportePassword = await bcrypt.hash("soporte123", 10);
    await User.create({ username: "soporte", name: "Soporte Técnico", email: "soporte@allprosum.local", password: soportePassword, role: "soporte", seller_code: null });
    console.log("👤 Soporte: soporte / soporte123");

    const clientePassword = await bcrypt.hash("123456", 10);
    await User.create({ username: "cliente1", name: "Cliente de Prueba", email: "cliente@test.com", password: clientePassword, role: "client", seller_code: null });
    console.log("👤 Cliente: cliente@test.com / 123456");

    await Product.bulkCreate([
      { name: "Laptop Gamer Pro", description: "Laptop de alto rendimiento.", price: 1250.00, stock: 10, image_url: "https://picsum.photos/seed/laptop/400/400", commission_rate: 0.05 },
      { name: "Smartphone X", description: "Teléfono de última generación.", price: 899.99, stock: 25, image_url: "https://picsum.photos/seed/phone/400/400", commission_rate: 0.05 },
      { name: "Auriculares Bluetooth", description: "Cancelación de ruido activa.", price: 59.99, stock: 50, image_url: "https://picsum.photos/seed/headphones/400/400", commission_rate: 0.05 },
      { name: "Monitor 4K Ultra", description: "Monitor 27 pulgadas 4K.", price: 350.00, stock: 15, image_url: "https://picsum.photos/seed/monitor/400/400", commission_rate: 0.05 },
      { name: "Teclado Mecánico RGB", description: "Teclado gamer con RGB.", price: 85.00, stock: 40, image_url: "https://picsum.photos/seed/keyboard/400/400", commission_rate: 0.05 }
    ]);
    console.log("📦 5 productos creados");

    console.log("\n🚀 Seed completado");
    console.log("================================");
    console.log("Admin:    admin@admin.com / admin");
    console.log("Vendedor: vendedor1 / vendedor123");
    console.log("Soporte:  soporte / soporte123");
    console.log("Cliente:  cliente@test.com / 123456");
    console.log("================================");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en seed:", error.message);
    process.exit(1);
  }
};

seedDatabase();