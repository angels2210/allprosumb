const sequelize = require('./config/database');

async function fix() {
  try {
    await sequelize.query('ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "username" VARCHAR(255)');
    console.log('✅ Columna username agregada');
    await sequelize.query('UPDATE "Users" SET username = name WHERE username IS NULL');
    console.log('✅ Username poblado desde name');
    await sequelize.query('ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "seller_code" VARCHAR(255)');
    console.log('✅ Columna seller_code agregada');
    process.exit(0);
  } catch(e) {
    console.error('❌', e.message);
    process.exit(1);
  }
}
fix();