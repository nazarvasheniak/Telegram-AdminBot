class Chat {
    constructor(
        id = 0, 
        title = '', 
        type = '', 
        all_members_are_administrators = false
    ) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.all_members_are_administrators = all_members_are_administrators;
    }
}

module.exports = Chat;