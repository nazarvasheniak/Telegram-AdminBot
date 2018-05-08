const express = require("express");
const fetch = require("node-fetch");
const ejs = require("ejs");

const app = express();
const router = express.Router();

const ChatMember = require("../database/ChatMember");
const Message = require("../database/Message");

const Components = {
    home: {
        src: '/root/telegram-admin/src/views/components/home/home.component.ejs'
    },
    topbar: {
        src: '/root/telegram-admin/src/views/common/components/top-bar/top-bar.component.ejs'
    }
};

const AppRoutes = {
    home: {
        path: '/',
        component: Components.home
    },
};

const Assets = {
    styles: [
        {
            path: '/bootstrap/css/bootstrap.min.css',
            src: '/root/telegram-admin/src/web/assets/bootstrap/css/bootstrap.min.css'
        },
        {
            path: '/css/main.css',
            src: '/root/telegram-admin/src/web/assets/css/main.css'
        }
    ],
    scripts: [
        {
            path: '/jquery/jquery-3.3.1.min.js',
            src: '/root/telegram-admin/src/web/assets/jquery/jquery-3.3.1.min.js'
        },
        {
            path: '/bootstrap/js/bootstrap.min.js',
            src: '/root/telegram-admin/src/web/assets/bootstrap/js/bootstrap.min.js'
        },
        {
            path: '/js/main.js',
            src: '/root/telegram-admin/src/web/assets/js/main.js'
        }
        
    ]
};

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', '/root/telegram-admin/src/views');

/* Assets */
Assets.styles.forEach(file => {
    router.get(file.path, (req, res) => {
        res.status(200)
            .sendFile(file.src);
    });
});

/* App routes */
Object.keys(AppRoutes).map((key, index) => {
    router.get(AppRoutes[key].path, (req, res) => {
        const data = {};

        (async() => {
            data.users = await ChatMember.getAll();
            res.status(200).render('index', data);
        })();
    });
});

Assets.scripts.forEach(file => {
    router.get(file.path, (req, res) => {
        res.status(200)
            .sendFile(file.src);
    });
});

router.get('/rules', (req, res) => {
    res.status(200)
        .sendFile('/root/telegram-admin/src/uploads/rules.txt');
});

app.use(router);

module.exports = app;