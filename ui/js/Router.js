import Route from "./Route";

export default class Router {
    constructor(routes) {
        let self = this;
        self.script = undefined;
        self.routes = routes;
        self.rootElem = document.getElementById('root');
        self.init();
    }

    init() {
        let self = this;
        window.addEventListener('hashchange', function (e) {
            self.hasChanged();
        });
        self.hasChanged();
    }

    hasChanged() {
        let self = this;
        for (let i = 0, length = self.routes.length; i < length; i++) {
            let route = self.routes[i];
            if (
                (window.location.hash.length === 0 && route.default)
                || route.isActiveRoute(window.location.hash.substr(1))
            ) {
                console.log('Going to route ' + route.name);
                self.goToRoute(route);
                delete self.script;
                console.log('Creating new script');
                self.script = new route.script();
            }
        }
    }

    goToRoute(route) {
        let self = this;
        self.rootElem.innerHTML = route.script.getHtml(); // this should be static
    }
}