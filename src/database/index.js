const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root:123456qwerty@localhost:3306/telegramadmin');

sequelize.sync();

module.exports = {
    sequelize
};