// public/js/profile/HomeController.js

(function() {

    'use strict';

    angular
        .module('pokemonManagerApp')
        .controller('HomeController', HomeController);


    function HomeController($scope, $location, ProfileService) {

        /**
         * This method returns the profile set in the ProfileService. If the
         * profile isempty, go back to /auth.
         */
        this.getProfile = function() {
          var profile = ProfileService.getProfile();

          if(!profile.username){
            $location.path('/auth');
          }

          return profile;
        }


        $scope.profile = this.getProfile();
    }

})();
