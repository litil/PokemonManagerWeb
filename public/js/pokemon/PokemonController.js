// public/js/pokemon/PokemonController.js

(function() {

    'use strict';

    angular
        .module('pokemonManagerApp')
        .controller('PokemonController', PokemonController);


    function PokemonController($scope, $location, $rootScope, PokemonService) {

        // initialize the user variable - debug purpose only
        $scope.user = {};

        $scope.getPokemonsList = function() {
            // check user existence in local storage
            // redirect to /auth if none is found
            var user = localStorage.getItem("user");
            if (!user || !JSON.parse(user).playerInfo) {
              $location.path( "/auth");
            }
            user = JSON.parse(user);

            // call the getPokemonsList method of the PokemonService
            PokemonService.getPokemonsList(user).then(function(response) {
                if (!response || !response.data){
                  alert('No pokemon info has been found in the response');
                  return ;
                }

                // create an array of arrays
                // inner arrays will contains pokemons of the same family
                var pokemons = response.data.pokemons;
                var pokemonFamiliesArray = [];

                debugger;

                var arrayTemp = [];
                for (var i = 0; i < pokemons.length; i++) {
                    if (i === 0){
                      arrayTemp.push(pokemons[i]);

                    } else if (arrayTemp.length === 0 || pokemons[i].pokemon_id === pokemons[i-1].pokemon_id) {
                        // same pokemon family
                        arrayTemp.push(pokemons[i]);

                    } else {
                      // not the same pokemon family
                      // add the previous array to the families array
                      pokemonFamiliesArray.push(arrayTemp);
                      arrayTemp = [];
                    }
                }

                // set the pokemons list, grouped by families, into the scope
                $scope.pokemonByFamily = pokemonFamiliesArray;

            }, function(response) {
                alert(response);
            });
        }

        $scope.getPokemonsList();

    }

})();
