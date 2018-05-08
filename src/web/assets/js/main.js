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

const message = new Message();
const alert = '<div class="alert fade show" role="alert"><span class="alert-text"></span><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

Object.values(document.querySelectorAll('button[data-toggle="modal"]'))
    .forEach(button => {
        button.addEventListener('click', function() {
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