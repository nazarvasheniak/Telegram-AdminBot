class Message {
    constructor(chatId = 0, text = '', status = 'empty') {
        this.chatId = chatId;
        this.text = text;
        this.status = status;
    }

    send() {
        const msg = this;

        if(this.text == '') {
            alert('Сообщение не может быть пустым!');
            
            return false;
        }

        let req = new XMLHttpRequest();
        let data = 'chatId='+ this.chatId +'&text='+ this.text;

        req.open('post', 'http://195.64.154.40:5000/bot/sendmessage', true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.onreadystatechange = function(e) {
            if(req.readyState != 4) {
                return;
            }

            if(req.status != 200) {
                msg.status = 'error';

                return 'Error: ' + req.statusText;
            }
        }
        req.send(data);
    }
}

const users = [];
const message = new Message();
const alert = '<div class="alert fade show" role="alert"><span class="alert-text"></span><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

function updateUsers() {
    let req = new XMLHttpRequest();
    req.open('get', 'http://195.64.154.40:5000/users', true);
    req.onreadystatechange = function(e) {
        if(req.readyState != 4) {
            return;
        }

        if(req.status != 200) {
            msg.status = 'error';

            return 'Error: ' + req.statusText;
        }

        let json = JSON.parse(req.response);

        json.forEach(user => {
            users.push(user);
        });
    }
    req.send();
}

updateUsers();

Object.values(document.querySelectorAll('button[data-target="#messagesHistory"]'))
    .forEach(button => {
        button.addEventListener('click', function() {
            let req = new XMLHttpRequest();

            req.open('get', 'http://195.64.154.40:5000/messages/'+ button.dataset.user, true);
            req.onreadystatechange = function(e) {
                if(req.readyState != 4) {
                    return;
                }
        
                if(req.status != 200) {
                    msg.status = 'error';
        
                    return 'Error: ' + req.statusText;
                }

                let messages = JSON.parse(req.response);
                let html = '';

                document.querySelector('#messagesHistoryLabel').innerHTML = 'История пользователя #' + button.dataset.user;

                if(!messages.length) {
                    html += '<div class="message-block"><div class="message-block-text">История сообщений пуста.</div></div>';
                } else {
                    messages.forEach(message => {
                        let date = new Date();
                        date.setTime(message.date * 1000);
                        
                        html += '<div class="message-block"><div class="message-block-title d-block p-2 bg-dark text-white"><h5>'+ date.toLocaleString() +'</h5></div><div class="message-block-text">'+ message.text +'</div></div>';
                    });
                }

                document.querySelector('#messagesHistory .messages-block').innerHTML = html;
            }
            req.send();
        });
    });

Object.values(document.querySelectorAll('button[data-target="#sendMessage"]'))
    .forEach(button => {
        button.addEventListener('click', function() {
            $('.alert').remove();
            document.body.insertAdjacentHTML('beforeend', alert);

            message.chatId = button.dataset.user;
        
            document.querySelector('#sendMessageLabel').innerHTML = 'Сообщение пользователю #' + message.chatId;
        });
    });

document.querySelector('button[data-toggle="sendmessage"]')
    .addEventListener('click', function() {
        message.text = document.querySelector('#messageText').value;
        message.send();
        message.status = 'sended';

        $('.alert').addClass('alert-success')
            .find('.alert-text')
            .html('Сообщение пользователю #'+ message.chatId +' отправлено!');
        
        $('.alert').fadeIn();

        setTimeout(function() {
            $('.alert .close').click();
        }, 3000);

        $('.modal').modal('hide');

        message.chatId = 0;
        message.text = '';
        message.status = 'empty';

        document.querySelector('#messageText').value = '';
    });

document.querySelector('button[data-toggle="sendmassmessage"]')
    .addEventListener('click', function() {
        $('.alert').remove();
        document.body.insertAdjacentHTML('beforeend', alert);

        message.text = document.querySelector('#massMessageText').value;

        users.forEach(user => {
            message.chatId = user.id;
            message.send();
            message.status = 'sended';
        });

        $('.alert').addClass('alert-success')
            .find('.alert-text')
            .html('Массовая рассылка успешно завершена!');
        
        $('.alert').fadeIn();

        setTimeout(function() {
            $('.alert .close').click();
        }, 3000);

        message.chatId = 0;
        message.text = '';
        message.status = 'empty';

        document.querySelector('#massMessageText').value = '';
    });

document.querySelector('button[data-toggle="searchbykey"]')
    .addEventListener('click', function() {
        let query = document.querySelector('#searchByKeyText').value;
        let req = new XMLHttpRequest();

        req.open('get', 'http://195.64.154.40:5000/messages/query/'+ query, true);
        req.onreadystatechange = function(e) {
            if(req.readyState != 4) {
                return;
            }
    
            if(req.status != 200) {
                msg.status = 'error';
    
                return 'Error: ' + req.statusText;
            }

            let messages = JSON.parse(req.response);
            let html = '';

            document.querySelector('#messagesSearchLabel').innerHTML = 'Результаты по запросу "'+ query +'":';

            if(!messages.length) {
                html += '<div class="message-block"><div class="message-block-text">Ничего не найдено.</div></div>';
            } else {
                messages.forEach(message => {
                    let date = new Date();
                    date.setTime(message.date * 1000);
                    
                    html += '<div class="message-block"><div class="message-block-title d-block p-2 bg-dark text-white"><h5>ID: <span style="font-weight: 500;">'+ message.from +'</span> | '+ date.toLocaleString() +'</h5></div><div class="message-block-text">'+ message.text +'</div></div>';
                });
            }

            document.querySelector('#messagesSearch .messages-block').innerHTML = html;
            $('#messagesSearch').modal('show');
            document.querySelector('#searchByKeyText').value = '';
        }
        req.send();
    });