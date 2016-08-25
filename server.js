var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var PokemonGO = require('pokemon-go-node-api');
var PokemonsJSON = require('./pokemons.json');
var ObjectID = mongodb.ObjectID;


var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// database url and collection
var MONGO_DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/pokemanager';
var CONTACTS_COLLECTION = "contacts";

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(MONGO_DB_URL, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});



// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}


// AUTHENTICATION routes below

/*
 * "/auth"
 * POST: signin to the Pokemon API
 *
 * It checks for username, password, location and provider.
 */
 app.post("/signin", function(req, res) {
   // check params emptiness
   if(!(req.body.username && req.body.password && req.body.location && req.body.provider)) {
     handleError(res, "Invalid user input", "Must provide a username, a password, a location and a provider", 400);
   }

  // check params validity
  var provider = req.body.provider;
  var username = req.body.username;
  var password = req.body.password;
  var location = {
      type: 'name',
      name: req.body.location || '7 place de la defense, Courbevoie'
  };
  if (provider != 'ptc' && provider != 'google'){
    handleError(res, "Invalid user input", "The provider must be either ptc or google", 400);
  }

  // initialize user
  var user = new PokemonGO.Pokeio();
  user.init(username, password, location, provider, function(err) {
      if (err) throw err;
      console.log('User successfully logged in');

      // return the user
      res.status(200).json(user);
  });

 });


 // PROFILE routes below

 /*
  * "/profile"
  * POST: fetch basic profile information corresponding to the given user.
  *
  */
  app.post("/profile", function(req, res) {
    // check params emptiness
    if(!(req.body.user)) {
      handleError(res, "Invalid user input", "Must provide user", 400);
    }

   // initialize user
   var user = new PokemonGO.Pokeio();
   user.playerInfo = req.body.user.playerInfo;
   user.GetProfile(function(err, profile) {
         if (err) throw err;

         console.log('1[i] Username: ' + profile.username);
         console.log('1[i] Poke Storage: ' + profile.poke_storage);
         console.log('1[i] Item Storage: ' + profile.item_storage);

         // return the profile
         res.status(200).json(profile);
     });

  });


  // POKEDEX routes below

  /*
   * "/pokedex"
   * POST: fetch pokedex information
   *
   */
  app.post("/pokedex", function(req, res) {
    // check params emptiness
    if(!(req.body.user)) {
      handleError(res, "Invalid user input", "Must provide user", 400);
    }

   // initialize user
   var user = new PokemonGO.Pokeio();
   user.playerInfo = req.body.user.playerInfo;
   user.GetInventory(function(err, inventory) {
         if (err) throw err;

         // initialize response
         var cleanedInventory = { player_stats: null, eggs : [], pokemons: [], items: [] };

         var inventoryDelta = inventory.inventory_delta;
         var inventoryItems = inventoryDelta.inventory_items;

         // loop over inventory items
         inventoryItems.forEach(function(item) {
            var inventory_item_data = item.inventory_item_data;

            // check for pokemon (egg and real pokemons)
            if (inventory_item_data.pokemon) {
                var pokemon = inventory_item_data.pokemon;
                if (!pokemon.is_egg) {
                  if (item.inventory_item_data && item.inventory_item_data.pokemon){
                      var pokemonTemp = item.inventory_item_data.pokemon;

                      if (pokemonTemp != null && pokemonTemp.pokemon_id != null) {
                          // the current entry is a pokemon
                          var pokemonId = pokemonTemp.pokemon_id;
                          PokemonsJSON.pokemon[pokemonId - 1].in_inventory = true
                     }
                  }
                }
            }
         });

         // return the full inventory
         res.status(200).json(PokemonsJSON);
     });
  });


  // POKEMONS routes below

  /*
   * "/profile"
   * POST: fetch all already catched pokemons, formats and returns them. It
   * fetches the pokemons by calling the GetInventory method.
   *
   */
  app.post("/pokemons", function(req, res) {
    // check params emptiness
    if(!(req.body.user)) {
      handleError(res, "Invalid user input", "Must provide user", 400);
    }

   // initialize user
   var user = new PokemonGO.Pokeio();
   user.playerInfo = req.body.user.playerInfo;
   user.GetInventory(function(err, inventory) {
         if (err) throw err;

         // initialize response
         var cleanedInventory = { player_stats: null, eggs : [], pokemons: [], items: [] };
         var familyMap = {};

         var inventoryDelta = inventory.inventory_delta;
         var inventoryItems = inventoryDelta.inventory_items;

         // loop over inventory items
         inventoryItems.forEach(function(item) {
            var inventory_item_data = item.inventory_item_data;

            // check for pokemon (egg and real pokemons)
            if (inventory_item_data.pokemon) {
                var pokemon = inventory_item_data.pokemon;
                if (pokemon.is_egg) {
                    cleanedInventory.eggs.push(pokemon);

                } else {
                  if (item.inventory_item_data && item.inventory_item_data.pokemon){
                      var pokemonTemp = item.inventory_item_data.pokemon;

                      if (pokemonTemp != null && pokemonTemp.pokemon_id != null) {
                          // the current entry is a pokemon
                          var pokemonId = pokemonTemp.pokemon_id;
                          var pokemonRet = {};

                          // format the current pokemon data
                          pokemonRet.id = pokemon.id;
                          pokemonRet.pokemon_id = pokemonId;
                          pokemonRet.name = PokemonsJSON.pokemon[pokemonId - 1].name;
                          pokemonRet.img = PokemonsJSON.pokemon[pokemonId - 1].img;
                          pokemonRet.type = PokemonsJSON.pokemon[pokemonId - 1].type;
                          pokemonRet.height = pokemonTemp.height_m;
                          pokemonRet.weight = pokemonTemp.weight_kg;
                          pokemonRet.evolve = null;  // TODO
                          pokemonRet.cp = pokemonTemp.cp;
                          pokemonRet.stamina = pokemonTemp.stamina;
                          pokemonRet.stamina_max = pokemonTemp.stamina_max;
                          pokemonRet.favorite = pokemonTemp.favorite;
                          pokemonRet.nickname = pokemonTemp.nickname;
                          pokemonRet.move_1 = pokemonTemp.move_1;
                          pokemonRet.move_2 = pokemonTemp.move_2;

                          // candy
                          // in pokemon json we have something like : "candy": "50 Staryu Candy"
                          var candyName = PokemonsJSON.pokemon[pokemonId - 1].candy;
                          candyName = candyName.substring(candyName.indexOf(" ") + 1, candyName.length);
                          candyName = candyName.substring(0, candyName.indexOf(" "));
                          pokemonRet.candy = {};
                          pokemonRet.candy.name = candyName;

                          // evolution
                          var candyStr = PokemonsJSON.pokemon[pokemonId - 1].candy;
                          if (candyStr !== "None") {
                            // it means this pokemon evolves
                            pokemonRet.evolve = {};

                            // we hope that the evolution is the next pokemon in the list
                            pokemonRet.evolve.name = PokemonsJSON.pokemon[pokemonId].name;
                            pokemonRet.evolve.id = PokemonsJSON.pokemon[pokemonId].id;

                            // needed candies
                            pokemonRet.evolve.needed_candies = candyStr.substring(0, candyStr.indexOf(" "));
                          }

                          // add the current pokemon into the array
                          cleanedInventory.pokemons.push(pokemonRet);
                     }
                  }
                }

            }

            // check for player stats
            if (inventory_item_data.player_stats) {
                var player = inventory_item_data.player_stats;
                cleanedInventory.player_stats = player;
            }

            // check for item
            if (inventory_item_data.item) {
                var item = inventory_item_data.item;
                cleanedInventory.items.push(item);
            }

            // check for pokemon family
            if(inventory_item_data.pokemon_family){
                var pokemon = inventory_item_data.pokemon_family;
                var id = pokemon['family_id'];
                var candy = pokemon['candy'];
                familyMap[PokemonsJSON.pokemon[id - 1].name] = candy;
            }
         });

         // sort the pokemons array depending on the pokemons name and then cp
         cleanedInventory.pokemons.sort(
           function(a, b){
              if (a.pokemon_id != b.pokemon_id){
                 return (a.pokemon_id - b.pokemon_id);
              } else {
                 return (b.cp - a.cp);
              }
           });

         // set the family candy information into each pokemon
         cleanedInventory.pokemons.forEach(function(item) {
            // we have a map family name / candy count
            if (item.candy.name !== undefined){
              item.candy.count = familyMap[item.candy.name];
            }
         });

         //response.pokemons = pokemonsArray;
         //response.count = pokemonsArray.length; // the count in the mobile app includes the egg
         //response.max = inventoryItems.length; // not sure it is the real "max" value

         // return the full inventory
         res.status(200).json(cleanedInventory);
     });
  });


  /*
   * "/pokemons/transfer"
   * POST: transfers the pokemon corresponding to the given id
   *
   */
  app.post("/pokemons/transfer", function(req, res) {
    // check params emptiness
    if(!(req.body.user)) {
      handleError(res, "Invalid user input", "Must provide user", 400);
    }

   // initialize user
   var user = new PokemonGO.Pokeio();
   user.playerInfo = req.body.user.playerInfo;

   // get the pokemon id
   var pokemonId = req.body.pokemonId;

   user.TransferPokemon(pokemonId, function(err, catchPokemonResponse) {
         if (err) throw err;

         // return the full inventory
         res.status(200).json(catchPokemonResponse);
     });
  });


  /*
   * "/pokemons/evolve"
   * POST: evolves the pokemon corresponding to the given id
   *
   */
  app.post("/pokemons/evolve", function(req, res) {
    // check params emptiness
    if(!(req.body.user)) {
      handleError(res, "Invalid user input", "Must provide user", 400);
    }

   // initialize user
   var user = new PokemonGO.Pokeio();
   user.playerInfo = req.body.user.playerInfo;

   // get the pokemon id
   var pokemonId = req.body.pokemonId;
   console.log(pokemonId);

   user.EvolvePokemon(pokemonId, function(err, catchPokemonResponse) {
         // for some reason, we have an error with : Error: Illegal wire type for field Message.Field .ResponseEnvelop.Pokemon.cp_multiplier: 5 (1 expected)
         if (err) throw err;

         // return the full inventory
         res.status(200).json(catchPokemonResponse);
     });
  });


/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/contacts", function(req, res) {
  db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/contacts", function(req, res) {
  var newContact = req.body;
  newContact.createDate = new Date();

  if (!(req.body.firstName || req.body.lastName)) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/contacts/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get contact");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/contacts/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/contacts/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete contact");
    } else {
      res.status(204).end();
    }
  });
});
