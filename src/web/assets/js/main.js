class Components {
    constructor(home = {}) {
        this.home = home;
    }
}

/* function setRoute() {
    const components = new Components();
    const pathname = window.location.pathname;

    Object.keys(components).map((key, index) => {
        if(components[key].path == pathname) {
            fetch(config.baseUrl + components[key].component).then((response) => {
                console.log(response);
            });
        }
    });
}
 */
