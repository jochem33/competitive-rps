// import needed packages
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const bodyParser = require("body-parser")

// allow cors?
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})


// static files are stored in 'public' folder
app.use(express.static('public'))

// use bodyparser for parsing POST requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Data object (needs to be moved to database)
let gameData = {
    "defaultGame": {
        players: {}
    }
}

// routes for Home, join and host page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html')
})

app.get('/join', (req, res) => {
    res.sendFile(__dirname + '/frontend/join.html')
})

app.get('/host', (req, res) => {
    res.sendFile(__dirname + '/frontend/host.html')
})



app.post('/api/join/', (req, res) => {
    const nickname = req.body.nickname
    const gamecode = req.body.gamecode

    // if game does not exist
    if(!Object.keys(gameData).includes(gamecode)){
        res.status(404).send('404: Game not Found')
        return
    }

    // if nickname is already taken
    if(Object.keys(gameData[gamecode].players).includes(nickname)) {
        res.status(400).send('400: Name already taken')
        return
    }
    let playercount = Object.keys(gameData[gamecode].players).length

    // if room is full
    if(playercount >= 2){
        res.status(400).send('400: Room full')
        return
    }

    // if everything is OK, assign a role and make a new dataBase entry for the player
    gameData[gamecode].players[nickname] = {
        score: 0,
        object: ""
    }

    // emit to every player that there is a new player
    io.in(gamecode).emit("playerUpdate", "")
    res.redirect('/g/' + req.body.gamecode)   
})


// route for hosting a game
app.post('/api/host', (req, res) => {
    gameData[req.body.gamecode] = {
        players: {},
        gamestate: "CHOOSE"
    }
    gameData[req.body.gamecode].players[String(req.body.nickname)] = {
        score: 0,
        object: ""
    }
    res.redirect('/g/' + req.body.gamecode)
})


// route for getting the playerdata when joining a game or after a state update
app.get('/api/players/:gamecode', (req, res) => {
    res.send(gameData[req.params.gamecode].players)
})



// route for getting the main html for the game
app.get('/g/:gameCode', (req, res) => {
    if(Object.keys(gameData).includes(req.params.gameCode)){
        res.sendFile(__dirname + '/frontend/game.html')
    } else {
        res.status(404).send('404: Page not Found')
    }
})





// function for all socket connections
io.on('connection', (socket) => {
    // add new connection to game room
    socket.join(socket.handshake.query["gameCode"])
    console.log("New user, room = ", Array.from(socket.rooms)[1])

    // announce updated gamestate to players
    stateUpdate(socket)

    // when a new line is received, sent line object to all players
    socket.on('chooseObject', (data) => {
        const gameCode = Array.from(socket.rooms)[1]
        console.log(gameData[gameCode].players[data.player], "player = " + data.player)
        gameData[gameCode].players[data.player].object = data.object
        stateUpdate(socket)
    })
})


// function for updating the state of a game
function stateUpdate(socket) {
    let gameCode = Array.from(socket.rooms)[1]
    if(Object.keys(gameData).includes(gameCode)){
        // console.log(gameData[gameCode])
        io.in(gameCode).emit("stateUpdate", gameData[gameCode])
    }
}


// start server
http.listen(3000, () => {
    console.log('listening on *:3000')
})