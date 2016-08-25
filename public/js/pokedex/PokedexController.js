// public/js/pokedex/PokedexController.js

(function() {

    'use strict';

    angular
        .module('pokemonManagerApp')
        .controller('PokedexController', PokedexController);


    function PokedexController($scope, $location, $rootScope, PokedexService) {

        // initialize the user variable - debug purpose only
        $scope.user = {};

        /**
         * This method gets the pokedex from the server.
         */
        $scope.getPokedex = function() {
            // check user existence in local storage
            // redirect to /auth if none is found
            var user = localStorage.getItem("user");
            if (!user || !JSON.parse(user).playerInfo) {
              $location.path( "/auth");
            }
            user = JSON.parse(user);

            // call the getPokedex method of the PokedexService
            PokedexService.getPokedex(user).then(function(response) {
                if (!response || !response.data){
                  alert('Pokedex information has not been found');
                  return ;
                }

                // create an array of arrays
                // inner arrays will contains pokemons of the same family
                var pokemons = response.data.pokemon;

                // set the pokemons list into the scope
                $scope.pokemons = pokemons;

            }, function(response) {
                alert(response);
            });
        }

        $scope.getPokedex();
    }

})();
