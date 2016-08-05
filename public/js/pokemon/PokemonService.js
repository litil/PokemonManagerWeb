// public/js/pokemon/PokemonService.js

(function() {

    'use strict';

    angular
        .module('pokemonManagerApp')
        .service("PokemonService", function($http) {

            this.getPokemonsList = function(user){
              return $http.post("/pokemons", {'user' : user}).
                  then(function(response) {
                      return response;
                  }, function(response) {
                      alert("Error fetching the list of pokemons.");
                  });
            }


        });

})();
