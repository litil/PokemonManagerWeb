// public/js/profile/HomeController.js

(function() {

    'use strict';

    angular
        .module('pokemonManagerApp')
        .controller('HomeController', HomeController);


    function HomeController($scope, ProfileService) {

        $scope.profile = ProfileService.getProfile();

    }

})();
