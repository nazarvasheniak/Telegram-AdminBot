const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root:123456qwerty@localhost:3306/telegramadmin', { define: { charset: 'utf8', dialectOptions: { collate: 'utf8mb4_unicode_ci' } } });

sequelize.sync();

module.exports = {
    sequelize
};