
let pokemonAPI = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=900';
let pokemonList = [];

async function getPokemonList() {

    try {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
      
        headers.append('Access-Control-Allow-Origin', 'http://localhost')
      
        headers.append('GET', 'POST', 'OPTIONS');
        let response = await fetch(pokemonAPI, {
            method: 'GET',
            headers: headers
        });
        let pagintedResponse = await response.json();
        pokemonList = pagintedResponse.results;
        await showPokemonList();
    } catch (error) {
        alert('Error al obtener la lista de pokemon del API, recarga la pantalla');
    }


}

async function showPokemonList(filterBy) {

    let initialDiv = '<div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">';
    let finalDiv = '</div>';

    let pokemonColumns = '';

    let filteredList =  filterBy ? pokemonList.filter((poke) => poke.name.toUpperCase().includes(filterBy.toUpperCase())): pokemonList;

    for (let pokemon of filteredList) {

        pokemonColumns +=
            `
        <div class="col" id="${pokemon.name}">
          <div class="card shadow-md">
            <div class="card-body">
              <p class="card-text"> ${pokemon.name}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button data-bs-target="#staticBackdrop" data-bs-toggle="modal" onclick="showPokemonInfo('${pokemon.name}','${pokemon.url}')" type="button" class="btn btn-sm btn-outline-primary">Ver información</button>
                </div>
              </div>
            </div>
          </div>
        </div>
                `;
    }

    let pokemonListDiv = document.getElementById('pokemonList');
    pokemonListDiv.innerHTML = (initialDiv + pokemonColumns + finalDiv);
}

async function showPokemonInfo(pokemonName, urlPokemonInfo) {
    try {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('GET', 'POST', 'OPTIONS');

        let response = await fetch(urlPokemonInfo, {
            method: 'GET',
            mode:'cors',
            headers: headers
        });
        let pokemonInfoResponse = await response.json();

        let data = pokemonInfoResponse;

        let contentBody = `
        <div>
            <img heigth="300" width="300" class="center" src='${data.sprites.other["official-artwork"]["front_default"]}'>
            <ul>
                <li> Número: ${data.id}</li>
                <li> Tipo: ${data.types.map((type)=> type.type.name).join(' ,')}</li>
                <li> Altura: ${data.height/10} m </li>
                <li> Peso:  ${data.weight/10} kg</li>
                <li> Habilidades: ${data.abilities.map((ability)=> ability.ability.name).join(' ,')}</li>
            </ul>
        
        </div>`;
        setDataModal(data.name, contentBody);

    } catch (error) {
        setDataModal('Error', `Error al obtener información de ${pokemonName}, vuelve a intentarlo`);
    }

}

function setDataModal(title, content) {
    let exampleModal = document.getElementById('staticBackdrop')
    let modalTitle = exampleModal.querySelector('.modal-title')
    let modalBodyInput = exampleModal.querySelector('.modal-body')

    modalTitle.textContent = title;
    modalBodyInput.innerHTML = content;
}

async function main() {
    await getPokemonList();
}

async function search(){
    let pokemonListDiv = document.getElementById('pokemonList');
    let searchInput = document.getElementById('searchInput');
    pokemonListDiv.innerHTML ='';
    
    await showPokemonList(searchInput.value);
}


// https://www.freecodecamp.org/news/javascript-debounce-example/

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }
  const processChange = debounce(async () => search());
main();


