// public/js/profile/ProfileService.js

(function() {

    'use strict';

    angular
        .module('pokemonManagerApp')
        .service("ProfileService", function($http) {

            var profile = {};

            this.getProfile = function() {
              return profile;
            }


            this.setProfile = function(tProfile) {
              profile = tProfile;
            }

            /**
             * This methods does a POST request to the /auth API endpoint to
             * authenticate the user with its credentials, the given provider
             * and a location.
             *
             * @param user contains all data needed to signin in
             */
            this.signin = function(user) {
                return $http.post("/auth", user).
                    then(function(response) {
                        return response;
                    }, function(response) {
                        alert("Error signin in the user.");
                    });
            }

            /**
             * This methods calls the /profile API endpoint to get basic profile
             * information about the signed in user.
             *
             * @param user already signed in user
             */
            this.getUserProfile = function(user) {
              var scope = this;

              return $http.post("/profile", {'user' : user}).
                  then(function(response) {
                      var profile = response.data;
                      scope.setProfile(profile);
                      return profile;
                  }, function(response) {
                      alert("Error while fetching user profile information.");
                  });
            }

        });

})();
