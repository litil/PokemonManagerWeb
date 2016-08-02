// public/js/authentication/AuthService.js

(function() {

    'use strict';

    angular
        .module('pokemonManagerApp')
        .service("AuthService", function($http) {
            this.signin = function(user) {
                debugger;

                return $http.post("/auth", user).
                    then(function(response) {
                        debugger;
                        return response;
                    }, function(response) {
                        alert("Error signin in the user.");
                    });
            }

        });

})();
