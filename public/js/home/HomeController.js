// public/js/home/HomeController.js

(function() {

    'use strict';

    angular
        .module('pokemonManagerApp')
        .controller('HomeController', HomeController);


    function HomeController($scope, $rootScope, $location, ProfileService) {

        /**
         * This method returns the profile set in the ProfileService. If the
         * profile isempty, go back to /auth.
         */
        this.getProfile = function() {
          var profile = ProfileService.getProfile();

          debugger;

          if(!profile.username){
            $location.path('/auth');
          } else if (profile.currency[1]){
            // set the stardust into the root scope (UGLY!)
            $rootScope.stardust = profile.currency[1].amount;
          }

          return profile;
        }


        $scope.profile = this.getProfile();
    }

})();
