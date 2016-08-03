// public/js/authentication/AuthController.js

(function() {

    'use strict';

    angular
        .module('pokemonManagerApp')
        .controller('AuthController', AuthController);


    function AuthController($scope, AuthService) {

        // initialize the user variable - debug purpose only
        $scope.user = {};
        $scope.user.username = 'guillaume.p.lambert@gmail.com';
        $scope.user.provider = 'google';
        $scope.user.location = '7 place de la defense, Courbevoie';

        /**
         * This methods calls the signin method of the AuthService to
         * authenticate the user with its credentials, the given provider
         * and a location.
         *
         * @param user contains all data needed to signin in
         */
        $scope.signin = function(user) {
            AuthService.signin(user).then(function(response) {
                debugger;

            }, function(response) {
                alert(response);
            });
        }

    }

})();
