const sequelize = require('./config/database');

async function migrate() {
  try {
    await sequelize.query('ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "first_name" VARCHAR(255)');
    await sequelize.query('ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "last_name" VARCHAR(255)');
    await sequelize.query('ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "seller_code" VARCHAR(255)');
    await sequelize.query('ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "username" VARCHAR(255)');
    console.log('✅ Columnas agregadas');
    process.exit(0);
  } catch(e) {
    console.error('❌', e.message);
    process.exit(1);
  }
}
migrate();