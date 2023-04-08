const ipAdress = "localhost:3000"

const baseURL = "http://" + ipAdress
const socketURL = "ws://" + ipAdress

// get data from local storage
const gamecode = localStorage.getItem("gamecode")
const nickname = localStorage.getItem("nickname")

// get word inputs and role text element from document
const roleText = document.getElementById("roleText")

const rock = document.getElementById("rock")
const paper = document.getElementById("paper")
const scissors = document.getElementById("scissors")

const countdown = document.getElementById("countdown")


let gamestate = "CHOOSE"


function toggleRPSButtons(value) {
    rock.disabled = value;
    paper.disabled = value;
    scissors.disabled = value;
}


rock.addEventListener("click", () => {
    socket.emit("chooseObject", {player: nickname, object: "rock"})
    toggleRPSButtons(true)
})

paper.addEventListener("click", () => {
    socket.emit("chooseObject", {player: nickname, object: "paper"})
    toggleRPSButtons(true)
})

scissors.addEventListener("click", () => {
    socket.emit("chooseObject", {player: nickname, object: "scissors"})
    toggleRPSButtons(true)
})


// connect to websocket via socket.io
const socket = io(socketURL, {query: {"gameCode": gamecode, "player": nickname}})


// get playerdata from server
function fetchPlayers() {
    return new Promise(function(resolve, reject){
        fetch(baseURL + "/api/players/" + gamecode)
        .then(response => response.json())
        .then(json => {
            let players = json
            let playerNames = Object.keys(players)
            let playerlist = document.getElementById("playerlist")
            
            // clear current player list
            while (playerlist.firstChild) {
                playerlist.removeChild(playerlist.firstChild);
            }

            // create player table and insert data
            for(let i = 0; i < playerNames.length; i++){
                let player = playerlist.insertRow(i)
                let name = player.insertCell(0)
                let score = player.insertCell(1)
                name.innerHTML = playerNames[i]
                score.innerHTML = players[playerNames[i]].score

                player.classList.add("player")
                player.classList.add("box")

                name.classList.add("playerName")
                score.classList.add("playerScore")
            }

            // resolve promise
            resolve(players)
        })
    })
}

// make a request for updating playerData when an update is anounced
socket.on("playerUpdate", () => {
    fetchPlayers()
    console.log("updated players")
})


// when the gamestate is updated, refresh the roles of all players
socket.on("stateUpdate", (data) => {
    if(data.gamestate == "CHOOSE"){
        toggleRPSButtons(false)
        countdown.innerHTML = 10 - data.gametime
    } else if(data.gamestate == "FIGHT") {
        toggleRPSButtons(true)
    }
    console.log(data)
})


fetchPlayers()
