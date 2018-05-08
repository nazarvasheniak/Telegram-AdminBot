class User {
    constructor({
        id, is_bot, first_name,
        last_name = '',
        username = '',
        language_code = ''
    }) {
        this.id = id;
        this.is_bot = is_bot;
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
        this.language_code = language_code;
    }
}

module.exports = User;