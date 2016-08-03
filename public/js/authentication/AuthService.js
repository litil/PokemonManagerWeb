// public/js/authentication/AuthService.js

(function() {

    'use strict';

    angular
        .module('pokemonManagerApp')
        .service("AuthService", function($http) {

            /**
             * This methods does a POST request to the /signin API endpoint to
             * authenticate the user with its credentials, the given provider
             * and a location.
             *
             * @param user contains all data needed to signin in
             */
            this.signin = function(user) {
                return $http.post("/signin", user).
                    then(function(response) {
                        return response;
                    }, function(response) {
                        alert("Error signin in the user.");
                    });
            }

        });

})();
