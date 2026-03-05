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

const removePlayer = async (id) => {
    try {
        const response = await fetch(`${API}/players/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to remove player!");
        }
    } catch (err) {
        console.error("Eroor removing player:", err)
    }
};

const addPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${API}/players`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(playerObj),
        });
        const result = await response.json();
        return result;
    } catch (err) {
        console.error("Something whent wrong adding that puppy!", err);
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
            <button id="delete-button">Remove pup from roster</button>
            </div>`;

        const backButton = document.querySelector('#back-button');        
        backButton.addEventListener('click', () => {
            selectedPlayer = null;
            render();
        }
    );   
        const deleteButton = document.querySelector('#delete-button');
        deleteButton.addEventListener('click', async () => {
            await removePlayer(selectedPlayer.id)
            players = await fetchPlayers()
            selectedPlayer = null;
            render();
        }
    )

} else {
        const formHTML = `
            <form id="add-player-form">
                <input type="text" name="playerName" placeholder="Name" required />
                <input type="text" name="playerBreed" placeholder="Breed" required />
                <button type="submit">Add to roster</button>
            </form>
            <hr>`;

        const rosterHTML = players.map(player => {
            return `
            <div class="player-card">
                <h3>${player.name}</h3>
                <img src="${player.imageUrl}" alt="${player.name}">
                <button class="details-button" data-id="${player.id}">See Details</button>
            </div>`;
        }).join('');

        app.innerHTML = formHTML + rosterHTML;

        const form = document.querySelector('#add-player-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const newPlayerData = {
                name: form.elements.playerName.value,
                breed: form.elements.playerBreed.value
            };

            await addPlayer(newPlayerData);
            players = await fetchPlayers();
            render();
        });
        const buttons = document.querySelectorAll('.details-button');
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const playerId = Number(button.dataset.id);
                selectedPlayer = players.find((p) => p.id === playerId);
                render();
            });
        });
    }
}


init()