// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2601-FTB-CT-WEB-PT"; 
const API = BASE + COHORT;
const app = document.querySelector(`#app`);

console.log("fetching from:", API)

let players = [];
let selectedPlayer = null;

const fetchPlayers = async () => {
    try {
        const playersResponse = await fetch (`${API}/players`);
        const playersJSON = await playersResponse.json();
        console.log(playersJSON)
        return playersJSON.data.players;
    } catch (err) {
        console.error("Fetch failed:", err);
        return [];
    }
};


const init = async () => {
    players = await fetchPlayers();

    render();
}

function render() {
    if(selectedPlayer) {
        app.innerHTML = `
            <div class="player-details">
            <h2>${selectedPlayer.name}</h2>
            <p>Breed: ${selectedPlayer.breed}</p>
            <p>Status: ${selectedPlayer.status}</p>
            <img src="${selectedPlayer.imageUrl}" alt="${selectedPlayer.name}">
            <button id="back-button">Back to Roster</button>
            </div>`;

        const backButton =document.querySelector('#back-button');
        backButton.addEventListener('click', () => {
            selectedPlayer = null;
            render()
        })

    } else {app.innerHTML = players.map(player => {
        return `
        <div class="player-card">
        <h3>${player.name}</h3>
        <img src="${player.imageUrl}" alt="${player.name}">
        <button class="details-button" data-id="${player.id}">See Details</button>
        </div>
        `
    }).join('');

    const buttons = document.querySelectorAll('.details-button');
        
    buttons.forEach ((button) => {
        button.addEventListener('click', () => {
            console.log('youve clicked a button!');
            playerString = button.dataset.id;
            let playerId = Number(playerString);

             const foundPlayer = players.find((p) => p.id === playerId);

             selectedPlayer = foundPlayer;

             render();
        }
        )
    }
    )
}
}

init();