
fetch("https://pokebuildapi.fr/api/v1/pokemon/limit/10")
  .then(response_obj => response_obj.json())
  .then(allPokemons => {
    const loadingTag_elem = document.querySelector(".loading");
    loadingTag_elem.remove();

    const pokemonGrid = document.querySelector(".pokemon-container");
    const searchBar = document.querySelector("#searchInput");
    const imageSearch = document.querySelector(".right_pok");
    
    const serInput = searchBar.value.trim()

    allPokemons.forEach(pokemon => {

      // 1つのポケモンカードを作成
      const cardPokemon = document.createElement("div");
      cardPokemon.classList.add("pokemon-card");

      cardPokemon.innerHTML = `
        <span>#${pokemon.id}</span>
        <h3>${pokemon.name}</h3>
        <img src="${pokemon.sprite}" alt="${pokemon.name}">`;

      // グリッドに追加
      pokemonGrid.appendChild(cardPokemon);


      searchBar.addEventListener("input", function () {
        if (serInput == pokemon.name) {
          const imagePokemon = document.createElement("img");
          imagePokemon.setAttribute("src", pokemon.image);
          imageSearch.appendChild(imagePokemon);

        }

      })

    });
  });
