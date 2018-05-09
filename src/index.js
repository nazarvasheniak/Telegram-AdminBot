/* Models */
const User = require("./models/User");
const Chat = require("./models/Chat");
const MessageModel = require("./models/Message");

/* Web Components */
/* const Components = require("./web/assets/js/components"); */

const http = require("http");
const express = require("express");
const fs = require("fs");

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
    questionChatId: 405744247
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

router.post('/messages/range', (req, res) => {
    (async() => {
        let messages = await Message.getMessagesByRange(req.body.start, req.body.end);
        res.send(messages);
    })();
});

router.get('/messages/query/:query', (req, res) => {
    (async() => {
        let messages = await Message.getMessagesByQuery(req.params.query);
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
bot.onText(/\/rules/, (msg, match) => {
    (async() => {
        let chatmember = await bot.getChatMember(msg.chat.id, msg.from.id);
        let resp = '';
        let readStream = fs.createReadStream('/root/telegram-admin/src/uploads/rules.txt', 'utf8');

        readStream.on('data', function(chunk) {  
            resp += chunk;
        }).on('end', function() {
            bot.sendMessage(chatmember.user.id, resp);
        });
    })();
});

// Command /adminlist
bot.onText(/\/adminlist/, (msg, match) => {
    let adminlist = [];

    (async() => {
        let chatmember = await bot.getChatMember(msg.chat.id, msg.from.id);
        let result = await bot.getChatAdministrators(AppOptions.chatId);
        let resp = '';

        result.forEach(row => {
            adminlist.push({
                firstname: row.user.first_name !== undefined ? row.user.first_name : '',
                lastname: row.user.last_name !== undefined ? row.user.last_name : '',
                username: row.user.username !== undefined ? row.user.username : ''
            });
        });

        adminlist.forEach(user => {
            resp += user.firstname + " " + user.lastname + "\n";
            resp += "@" + user.username + "\n";
            resp += "-------------------------\n\n";
        });

        bot.sendMessage(chatmember.user.id, resp);
    })();
});

// Command /question
bot.onText(/\/question (.+)/, (msg, match) => {
    (async() => {
        let chatmember = await bot.getChatMember(msg.chat.id, msg.from.id);
        let question = match[1];
        let respdata = {
            firstname: msg.from.first_name !== undefined ? msg.from.first_name : '',
            lastname: msg.from.last_name !== undefined ? msg.from.last_name : '',
            username: msg.from.username !== undefined ? msg.from.username : ''
        };
        let resp = "Вопрос от пользователя: \n";

        resp += respdata.firstname + " " + respdata.lastname + "\n";
        resp += "@" + respdata.username + "\n";
        resp += "Текст: " + question;

        bot.sendMessage(AppOptions.questionChatId, resp);
        bot.forwardMessage(AppOptions.questionChatId, msg.chat.id, msg.message_id);
    })();
});

bot.onText(/\/question@nazaradmin_bot (.+)/, (msg, match) => {
    (async() => {
        let chatmember = await bot.getChatMember(msg.chat.id, msg.from.id);
        let question = match[1];
        let respdata = {
            firstname: msg.from.first_name !== undefined ? msg.from.first_name : '',
            lastname: msg.from.last_name !== undefined ? msg.from.last_name : '',
            username: msg.from.username !== undefined ? msg.from.username : ''
        };
        let resp = "Вопрос от пользователя: \n";

        resp += respdata.firstname + " " + respdata.lastname + "\n";
        resp += "@" + respdata.username + "\n";
        resp += "Текст: " + question;

        bot.sendMessage(AppOptions.questionChatId, resp);
        bot.forwardMessage(AppOptions.questionChatId, msg.chat.id, msg.message_id);
    })();
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
            let chatmember = await bot.getChatMember(msg.chat.id, msg.from.id);
            let message = new MessageModel(msg.message_id, chatmember.user.id, msg.date, msg.text);

            await Message.add(message);
        })().catch(error => {
            console.log(error);
        });
    }
});