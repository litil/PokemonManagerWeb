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

            this.transferPokemon = function(user, pokemonId){
              return $http.post("/pokemons/transfer", {'user' : user, 'pokemonId' : pokemonId}).
                  then(function(response) {
                      return response;
                  }, function(response) {
                      alert("Error transfering the pokemon");
                  });
            }

            this.evolvePokemon = function(user, pokemonId){
              debugger;
              return $http.post("/pokemons/evolve", {'user' : user, 'pokemonId' : pokemonId}).
                  then(function(response) {
                      return response;
                  }, function(response) {
                      alert("Error transfering the pokemon");
                  });
            }

        });

})();
