# PokemonManagerWeb
PokemonManagerWeb is a web app built to help you managing your pokemon profile. The main goal of this project is to be able to quickly know which pokemons you should evolve or the ones you should transfer. 

This project uses the [Pokemon Go Node API](https://github.com/Armax/Pokemon-GO-node-api).

## Installation and Usage
Be sure to have a running mongod service before trying to start the server. 
```
npm install 
```
```
node server.js
```

## Screenshots 
Here is the pokemons list where you can see most of your pokemons' attributes and, most of all, where you can evolve and transfer them. You won't have to wait for 30 seconds between each evolution like in the game, so you will save a lot of time!
![alt tag](https://raw.githubusercontent.com/litil/PokemonManagerWeb/master/docs/images/pokemons_list.png)

## Todos
Obviously, this app still needs a LOT of work :
  * `Auth`
    * mostly design improvements
  * `Home`
    * display profile information
  * `Pokemons` 
    * improve the existing ugly design
    * find a way to get the attacks information
    * highlight the pokemons that could be evolved
    * count the pokemons that could be evolved
    * estimate how many XP points the user would earned by evolving all his "evolvable" pokemons
  * `pokedex`
    * display the inventory, it's really not a top priority
    
## Stack
A full Javascript stack has been chosen for this project : 
  * `UI` - AngularJS + Bootstrap 3
  * `Server Side` - NodeJS, using the Pokemon Go Node API
  * `Database` - MongoDB, not really used yet though
  * `Cloud Platform` - Heroku
  


