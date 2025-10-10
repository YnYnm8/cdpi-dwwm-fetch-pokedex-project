
function main() {
  fetch("https://pokebuildapi.fr/api/v1/pokemon/limit/100")
    .then(response_obj => response_obj.json())
    .then(allPokemons => {
      printLeftPokemons(allPokemons);

    });
}
main();
handlePokemonSearch();


function printLeftPokemons(allPokemons) {
  const loadingTag_elem = document.querySelector(".loading");
  loadingTag_elem.remove();

  const pokemonList = document.querySelector(".pokemon-list");

  allPokemons.forEach(pokemon => {
    // On récupère le template de carte Pokémon
    const templatePokemon = document.querySelector(".template-pokemon");
    // On clone le contenu du template
    const clone = templatePokemon.content.cloneNode(true);
    // On insère les données du Pokémon dans le clone
    clone.querySelector(".id").textContent = " # ID " + pokemon.id;
    clone.querySelector(".name").textContent = pokemon.name;
    clone.querySelector(".sprite").src = pokemon.sprite;
    clone.querySelector(".sprite").alt = pokemon.name;
    const pokemonCard = clone.querySelector(".pokemon-card");

    // Déplacer le appendChild ici après avoir défini les events
    pokemonList.appendChild(clone);

    pokemonCard.addEventListener("click", function () {
      console.log(pokemon.name);
      printRightPokemon(pokemon);

    });
  });
}
// function renderPagination() {
//   const pagiantionContainer = document.querySelector(".pagination");
//   pagiantionContainer.innerHTML = "";
// }
function printRightPokemon(pokemon) {
  const templateDetails = document.querySelector(".template-details");

  const rightPokemon = document.querySelector(".right_pokemon");

  rightPokemon.innerHTML = "";

  const cloneDetail = templateDetails.content.cloneNode(true);
  cloneDetail.querySelector(".pokemon-id").textContent = " ID " + pokemon.id;
  cloneDetail.querySelector(".pokemon-name").textContent = " Nom " + pokemon.name;
  cloneDetail.querySelector(".pokemon-img").src = pokemon.image;
  cloneDetail.querySelector(".pokemon-img").alt = pokemon.name;

  // Sélection du conteneur .type-list
  const typeList = cloneDetail.querySelector(".type-list");

  pokemon.apiTypes.forEach(type => {
    const typeImg = document.createElement("img");
    typeImg.src = type.image;
    typeImg.alt = type.name;
    typeImg.title = type.name;
    typeImg.classList.add("type-icon");
    typeList.appendChild(typeImg);

  });
  rightPokemon.appendChild(cloneDetail);
  addEvolution(pokemon, cloneDetail);
}
function handlePokemonSearch() {

  const inputElem = document.querySelector("#searchInput");
  const button = document.querySelector(".searchButton");

  button.addEventListener("click", function () {

    const rawValue = inputElem.value;
    const cleanValue = rawValue.trim().toLowerCase();

    if (cleanValue === "") return;

    fetch(`https://pokebuildapi.fr/api/v1/pokemon/${cleanValue}`)
      .then(response_obj => {
        if (!response_obj.ok) {

          throw new Error("We can't find that pockemon");
        }

        return response_obj.json()
      })
      .then(pokemon_obj => {
        console.log("success:", pokemon_obj);
        printRightPokemon(pokemon_obj);
      })
      .catch(err => {
        console.error("error:", err.message);
        document.querySelector(".right_pokemon").innerHTML =
          `<p style="color:red;">${err.message}</p>`;

      });
  });
};

function addEvolution(pokemon, cloneDetail) {
  // On sélectionne le conteneur où on affichera l'évolution
  const evolutionList = document.querySelector(".evolution-list");

  // On vide le conteneur avant d'ajouter l'évolution
  evolutionList.innerHTML = "";

  // Vérifie si le Pokémon a une évolution
  if (pokemon.apiEvolutions && pokemon.apiEvolutions.length > 0) {
    const evo = pokemon.apiEvolutions[0]; // On prend la première (et unique) évolution

    // Crée un <p> pour afficher le nom et l'ID
    const newP = document.createElement("p");
    newP.textContent = `#${evo.pokedexId} - ${evo.name}`;
    evolutionList.appendChild(newP);

    // Récupère les données complètes de l'évolution pour le sprite
    fetch(`https://pokebuildapi.fr/api/v1/pokemon/${evo.pokedexId}`)
      .then(response_obj => response_obj.json())
      .then(evolution => {
        const evoSprite = document.createElement("img");
        evoSprite.src = evolution.sprite;
        evoSprite.alt = evolution.name;
        evoSprite.classList.add("evolution-sprite");
        const evolutions = document.querySelector(".evolutions")
        evolutionList.appendChild(evoSprite);
        evolutions.addEventListener("click",function(){
          printRightPokemon(evolution);
          
        })
      });

  } else {
    // Si pas d'évolution, affiche un message
    const noEvo = document.createElement("p");
    noEvo.textContent = "Aucune évolution";
    evolutionList.appendChild(noEvo);
  }

}
