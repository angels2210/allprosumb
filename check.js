const { User } = require('./models');
const sequelize = require('./config/database');
sequelize.sync().then(async () => {
  const users = await User.findAll({ attributes: ['id','username','email','role'] });
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });