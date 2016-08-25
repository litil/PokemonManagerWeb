// public/js/pokedex/PokedexService.js

(function() {

    'use strict';

    angular
        .module('pokemonManagerApp')
        .service("PokedexService", function($http) {

            this.getPokedex = function(user){
              return $http.post("/pokedex", {'user' : user}).
                  then(function(response) {
                      return response;
                  }, function(response) {
                      alert("Error fetching the pokedex.");
                  });
            }

        });

})();
