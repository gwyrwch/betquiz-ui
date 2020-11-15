import Route from "./Route";
import Router from "./Router";
import Table from "./Table";
import SignInUp from "./SignInUp";
import Profile from "./Profile";

(function () {
    function init() {
        let router = new Router([
            new Route('sign_in_up', 'signInUp.html', true, SignInUp),
            new Route('table', 'table.html', false, Table),
            new Route('profile', 'profile.html', false, Profile)

        ]);
    }
    init();
}());

