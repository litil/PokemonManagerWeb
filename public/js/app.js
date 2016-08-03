angular.module("pokemonManagerApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/home", {
                controller: "HomeController",
                templateUrl: "home.html"
            })
            .when("/auth", {
                controller: "AuthController",
                templateUrl: "auth.html"
            })
            .otherwise({
                redirectTo: "/auth"
            })
    });
