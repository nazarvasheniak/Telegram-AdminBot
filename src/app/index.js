const express = require("express");
const fetch = require("node-fetch");
const ejs = require('ejs');

const app = express();
const router = express.Router();

const Components = {
    home: {
        src: '/root/telegram-admin/src/web/components/home/home.component.ejs'
    },
    topbar: {
        src: '/root/telegram-admin/src/web/common/components/top-bar/top-bar.component.ejs'
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
        const options = {};

        new Promise((resolve, rejected) => {
            ejs.renderFile(AppRoutes[key].component.src)
                .then(file => options.router = file);
        
            ejs.renderFile(Components.topbar.src)
                .then(file => options.topbar = file);
        }).then(result => {
            res.status(200)
                .render('index', {
                    router: ejs.renderFile(AppRoutes[key].component.src),
                    topbar: ejs.renderFile(Components.topbar.src),
                });
        });        
    });
});

Assets.scripts.forEach(file => {
    router.get(file.path, (req, res) => {
        res.status(200)
            .sendFile(file.src);
    });
});

app.use(router);

module.exports = app;