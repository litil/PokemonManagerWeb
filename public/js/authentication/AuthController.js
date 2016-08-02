// public/app/components/auth/authController.js

(function() {

    'use strict';

    angular
        .module('pokemonManagerApp')
        .controller('AuthController', AuthController);


    function AuthController($scope, AuthService) {

        $scope.signin = function(user) {
            debugger;
            AuthService.signin(user).then(function(response) {
                debugger;

                //var contactUrl = "/contact/" + doc.data._id;
                //$location.path(contactUrl);

            }, function(response) {
                alert(response);
            });
        }

    }

})();
