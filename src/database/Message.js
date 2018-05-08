const Sequelize = require('sequelize');
const sequelize = require("./index").sequelize;

const MessageModel = require("../models/Message");

const Message = sequelize.define('message', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false
    },
    from: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    date: {
        type: Sequelize.INTEGER
    },
    text: {
        type: Sequelize.STRING
    }
});

async function add(message) {
    await Message.build(message).save();
}

async function getAll() {
    let messages = await Message.findAll();

    return messages.map(message => new MessageModel(message.id, message.from, message.date, message.text));
}

async function getMessagesByUserId(userId) {
    let messages = await Message.findAll({where: {from: userId}});

    return messages.map(message => new MessageModel(message.id, message.from, message.date, message.text));
}

module.exports = {
    add,
    getAll,
    getMessagesByUserId
};