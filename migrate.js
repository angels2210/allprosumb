const sequelize = require('./config/database');

sequelize.query(`
  ALTER TABLE "Users" 
  ADD COLUMN IF NOT EXISTS "username" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "seller_code" VARCHAR(255);
`).then(() => {
  console.log('✅ Columnas agregadas correctamente');
  process.exit(0);
}).catch(e => {
  console.error('❌', e.message);
  process.exit(1);
});