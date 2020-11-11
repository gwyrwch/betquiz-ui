export default class Route {
    constructor(name, htmlName, defaultRoute, script) {
        this.name = name;
        this.htmlName = htmlName;
        this.default = defaultRoute;
        this.script = script;
    }

    isActiveRoute (hashedPath) {
        return hashedPath.replace('#', '') === this.name;
    }
}