/* Models */
const User = require("./models/User");
const Chat = require("./models/Chat");
const MessageModel = require("./models/Message");

/* Web Components */
/* const Components = require("./web/assets/js/components"); */

const http = require("http");
const express = require("express");

const app = require("./app/index");
const bodyParser = require("body-parser");

const router = express.Router();

const ChatMember = require("./database/ChatMember");
const Message = require("./database/Message");

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

router.post('/bot/sendmessage', (req, res) => {
    bot.sendMessage(req.body.chatId, req.body.text);
    res.status(200);
});

router.get('/users', (req, res) => {
    (async() => {
        let users = await ChatMember.getAll();
        res.send(users);
    })();
});

router.get('/messages', (req, res) => {
    (async() => {
        let messages = await Message.getAll();
        res.send(messages);
    })();
});

router.get('/messages/:userId', (req, res) => {
    (async() => {
        let messages = await Message.getMessagesByUserId(req.params.userId);
        res.send(messages);
    })();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(router);

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
    if(msg.chat.id == AppOptions.chatId) {
        bot.getChatMember(msg.chat.id, msg.from.id)
            .then(chatmember => {
                let user = new User(chatmember.user);
                
                (async() => {
                    await ChatMember.add(user);
                })().catch(error => {
                    console.log(error);
                });
            }).catch(error => {
                console.log(error);
            });
        
        (async() => {
            let message = new MessageModel(msg.message_id, msg.from.id, msg.date, msg.text);

            await Message.add(message);
        })().catch(error => {
            console.log(error);
        });
    }
});