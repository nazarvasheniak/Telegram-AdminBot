/* Models */
const Chat = require("./models/Chat");

/* Web Components */
/* const Components = require("./web/assets/js/components"); */

const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const app = require("./app/index");
const router = express.Router();

const TelegramBot = require("node-telegram-bot-api");
const BotToken = '583549843:AAHs8099KipsR-zqglLH26BtEBaXaF_2zXw';

const BotOptions = {
    polling: true
};

const AppOptions = {
    port: 5000,
    chatId: -263200970,
};

const bot = new TelegramBot(BotToken, BotOptions);
const chatInfo = new Chat();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

/* Server */
http.createServer(app).listen(AppOptions.port, function(req, res) {
    bot.getChat(AppOptions.chatId)
        .then(chat => {
            chatInfo.id = chat.id;
            chatInfo.title = chat.title;
            chatInfo.type = chat.type;
            chatInfo.all_members_are_administrators = chat.all_members_are_administrators;
        });

    console.log(`Listening on *:${AppOptions.port}`);
});

/* Bot commands */
// Command /start
bot.onText(/\/start (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = 'Hello!';
    
    bot.sendMessage(chatId, resp);
});

// Command /rules
bot.onText(/\/rules (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    
    bot.sendMessage(chatId, resp);
});

// Command /adminlist
bot.onText(/\/adminlist (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    
    bot.sendMessage(chatId, resp);
});

// Command /question
bot.onText(/\/question (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    
    bot.sendMessage(chatId, resp);
});

/* Main */
bot.on('message', (msg) => {
    bot.getChat(AppOptions.chatId)
        .then(chat => {
            console.log(chat);
        });
});