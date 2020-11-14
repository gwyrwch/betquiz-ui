import Route from "./Route";
import Router from "./Router";
import Table from "./Table";
import SignInUp from "./SignInUp";

(function () {
    function init() {
        let router = new Router([
            // todo: change table to login
            new Route('sign_in_up', 'signInUp.html', true, SignInUp),
            new Route('table', 'table.html', false, Table)

        ]);
    }
    init();
}());

