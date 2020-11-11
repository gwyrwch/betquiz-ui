import Route from "./Route";
import Router from "./Router";
import Table from "./Table";

(function () {
    function init() {
        let router = new Router([
            // todo: change table to login
            new Route('table', 'table.html', true, Table),
        ]);
    }
    init();
}());

