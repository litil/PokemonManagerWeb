// public/app/components/auth/authController.js

(function() {

    'use strict';

    angular
        .module('pokemonManagerApp')
        .service("AuthService", function($http) {
            this.signin = function(user) {
                return $http.post("/auth", user).
                    then(function(response) {
                        return response;
                    }, function(response) {
                        alert("Error signin in the user.");
                    });
            }

        });

})();
