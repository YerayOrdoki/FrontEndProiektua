const API_BASE_URL = 'https://www.freetogame.com/api';

async function bilatuApi(terminoa, mota) {
  // TODO
  const bilaketa = document.getElementById('form-bilatzaile')
  bilaketa.onsubmit = function(event){

    let genero = document.getElementById('input-bilaketa').value;
    let erantzuna = fetch(API_BASE_URL,`?category=${genero}`);
    //GET https://www.freetogame.com/api/games?category=shooter

    //https://www.freetogame.com/api
    /*
    
      /games: Retrieve a list of all free-to-play games.
      /game?id={game_id}: Retrieve details of a specific game by its ID.
      /games?category={category_name}: Retrieve a list of all available games from a specific genre.
      /games?platform={platform_name}: Retrieve a list of all available games from a specific platfo+9rm.
      /games?sort-by={sort_name}: Sort games by release date, alphabetical or relevance.
    
    */ 
   //bat baino gehiago bilaketa mota combobox bitaten, amaileran egin daiteke, eta horren arabera API deia egin
  }
}
