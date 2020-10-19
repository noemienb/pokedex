const list = document.getElementById("list");
const description = document.getElementById("description");

const api = "https://pokeapi.co/api/v2/pokemon?limit=150";

let pokemons = {};

let HTMLObjects = [];

let pokemonLength = 0;

/**
 * Try to parse a response as JSON data
 */
function transformToJson(response) {
    if (response.ok) {
        return response.json();
    }

    throw Error("Content not loaded");
}

/**
 * Clear the list of all its items
 */
function emptyList() {
    // ...
}

function fetchPokemon(pokemonsEntree, pokemonsSortie) {
    const tableau = Object.keys(pokemonsEntree);
    let longueur;

    if (pokemonLength == 0) {
        pokemonLength = tableau.length;
    }

    if (tableau.length != 0) {
        const pokemonUrl = pokemonsEntree[tableau[0]].url;

        const item = document.createElement("li");
        const img = document.createElement("img");
        const name = document.createElement("div");

        fetch(pokemonUrl).then(transformToJson).then((infosPoke) => {

            name.innerHTML = infosPoke.name
            img.src = infosPoke.sprites.front_default;

            item.appendChild(name)
            item.appendChild(img)
            item.addEventListener("click", function() { showDescription(infosPoke) });

            HTMLObjects.push(item)

            pokemonsSortie[tableau[0]] = infosPoke;
            delete pokemonsEntree[tableau[0]];

            longueur = Object.keys(pokemonsSortie).length;

            const flottant = (longueur / pokemonLength) * 100;
            pourcentage.innerText = Math.round(flottant);
            fetchPokemon(pokemonsEntree, pokemonsSortie);

        });
    } else {
        for (let element of HTMLObjects) {
            list.appendChild(element)
        }
    }
}


/**
 * fill the item list with values
 */
function fillList(json) {
    emptyList();
    fetchPokemon(json.results, pokemons)
}

/**
 * Fill and display the description
 */
function showDescription(data) {
    description.classList.add("show");
    console.log(data);
    const image = document.createElement("img");
    image.src = data.sprites.other["official-artwork"].front_default;
    document.querySelector("dd.image").innerHTML = "";
    document.querySelector("dd.image").appendChild(image);

    let $name = document.querySelector("dd.name");
    let $poids = document.querySelector("dd.weight");
    let $taille = document.querySelector("dd.height");
    let $type = document.querySelector("dd.types");
    $name.innerHTML = data.name;
    $poids.innerHTML = data.weight;
    $taille.innerHTML = data.height;
    $type.innerHTML = "";
    data.types.forEach(type => {
        let nomDuType = type.type.name
        let aucunTypeAffiché = $type.innerHTML == "";
        if (!aucunTypeAffiché) { $type.innerHTML += ", " }
        $type.innerHTML += nomDuType;
        // fire, water
    });

}


/**
 * Hide the description
 */
function hideDescription() {
    description.classList.remove("show");
}

// Fetch the API end-point and fill the list
fetch(api).then(transformToJson).then(fillList);