

// declaro la direccion de la API para obtener la lista de pokemones
let pokemonAPI = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=900';
// variable para almacenar los pokemones
let pokemonList = [];

// Metodo para obtener la lista de pokemones
// Utilizamos la funcion fetch para hacer la llamada al API 
// se necesita headers porque mandaba error de allow-origin
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
        // Se transforma la respuesta con .json para estructurarlo como objetos
        let pagintedResponse = await response.json();
        pokemonList = pagintedResponse.results;
        // Se muestran las tarjetas con bootstrap y el html
        await showPokemonList();
    } catch (error) {
        alert('Error al obtener la lista de pokemon del API, recarga la pantalla');
    }


}

async function showPokemonList(filterBy) {

    // Iniciamos la columna de bootstrap para el contenedor
    let initialDiv = '<div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">';
    // el div final para cerrar el contenedor de las columnas
    let finalDiv = '</div>';

    let pokemonColumns = '';

    // se hacen los filtros por coincidencias entre lo que ingreso en filterBy
    // Se transforman las variables de nombre y el filterBy en mayusculas para hacer
    // la coincidencia con lo que se ingresa
    // la coincidencia se hace con el .includes()
    let filteredList =  filterBy ? pokemonList.filter((poke) => poke.name.toUpperCase().includes(filterBy.toUpperCase())): pokemonList;

    for (let pokemon of filteredList) {

        // se genera el card con el nombre del pokemon 

        // se genera un boton para mostrar el modal con la información del pokemon
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

    // se obtienen el div de los pokemones para hacer el html 
    // con la parte inicial + cards de pkemones y al ultimo cerramos el div para las tarjetass
    let pokemonListDiv = document.getElementById('pokemonList');
    pokemonListDiv.innerHTML = (initialDiv + pokemonColumns + finalDiv);
}

async function showPokemonInfo(pokemonName, urlPokemonInfo) {
// cada plista de pokemon tiene una url para obtener los detalles del mismo
// se hace el request con fetch
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
        // se hace el parse de la respuesta con .json()
        let pokemonInfoResponse = await response.json();

        let data = pokemonInfoResponse;


        // se generara el html que se mostrará en el modal 
        // con la imagen 
        // tipos con el metodo que encontre en en stackoverflow
        // el peso y altura estaan en otras medidas por eso se tiene que dividir entre 10
        // se concatenan las habilidades y tipos con el map y se juntan con el join() 
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
        // se setea la información del modal con el 
        // content body y la info que tiene
        setDataModal(data.name, contentBody);

    } catch (error) {
        setDataModal('Error', `Error al obtener información de ${pokemonName}, vuelve a intentarlo`);
    }

}

function setDataModal(title, content) {

    // se obtiene el modal statico de bootstrap 
    // se obtienen las etiquetas y zonas del modal y del body para poder
    // poner información en el titulo y en el contenido
    // puede ser el error o el html de la info
    let exampleModal = document.getElementById('staticBackdrop')
    let modalTitle = exampleModal.querySelector('.modal-title')
    let modalBodyInput = exampleModal.querySelector('.modal-body')

    modalTitle.textContent = title;
    modalBodyInput.innerHTML = content;
}

async function main() {
    await getPokemonList();
}

// esta busqueda solo obtiene el valor del input search y se manda a llamar 
// el metodo de mostrar pokemon con el filtro respectivo en el mismo metodo
async function search(){
    let pokemonListDiv = document.getElementById('pokemonList');
    let searchInput = document.getElementById('searchInput');
    pokemonListDiv.innerHTML ='';
    
    await showPokemonList(searchInput.value);
}


// Busqueda con tiempo de espera
// https://www.freecodecamp.org/news/javascript-debounce-example/
// :)
// :)

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }
  const processChange = debounce(async () => search());
main();


