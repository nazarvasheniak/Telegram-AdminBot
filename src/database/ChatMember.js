const Sequelize = require('sequelize');
const sequelize = require("./index").sequelize;

const User = require("../models/User");

const ChatMember = sequelize.define('chatmember', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false
    },
    is_bot: {
        type: Sequelize.BOOLEAN
    },
    first_name: {
        type: Sequelize.STRING
    },
    last_name: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING
    },
    language_code: {
        type: Sequelize.STRING
    }
});

async function add(user) {
    await ChatMember.findOrCreate({
        where: { id: user.id },
        defaults: {
            id: user.id,
            is_bot: user.is_bot,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            language_code: user.language_code
        }
    });
}

async function getAll() {
    const users = await ChatMember.findAll();

    return users.map(user => new User(user));
}

module.exports = {
    add,
    getAll
};