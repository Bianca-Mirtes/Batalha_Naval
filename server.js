const http = require('http');
const express = require('express');

const app = express();
const websocketServer = require("websocket").server
const httpServer = http.createServer();

app.use(express.static('public'));

httpServer.listen('8080', () => console.log("Server listening on port 8080"));
const wsServer = new  websocketServer({
    httpServer: httpServer,
});

app.listen('8081', () => console.log("listen on http port 8081"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));


let clients = new Set();
let games = new Set();

let play1 = null;
let play2 = null;
let map1 = null;
let map2 = null;

let numClients = 0;


wsServer.on('request', request => {
    const connection = request.accept(null, request.origin);
    numClients++;

    connection.on('open', () => {
        console.log('Cliente Conectado!!!');
    });

    connection.on('close', () => {
        numClients--;
        clients.delete({'connection': connection});
        console.log("Conexão Encerrada!!!");
    });

    connection.on('message', (message) => {
        const result = JSON.parse(message.utf8Data);

        // Fim de jogo
        if(result.method === "EndGame"){
            games.forEach((game) => {
                if(game.id === result.gameID){ // acha o jogo 
                    if(game.playOne === result.clientID){ // caso o ganhador seja o play1
                        const payload = {
                            'method' : "Winner"
                        }
                        connection.send(JSON.stringify(payload)) // avisa ao play que ele ganhou
                        clients.forEach((client) =>{
                            if(client.clientID === game.playTwo){ // acha o perdedor
                                wsServer.connections.forEach((Connection) =>{
                                    if(Connection === client.connection){ // acha a conexão
                                        const payload = {
                                            'method' : "Loser"
                                        }
                                        Connection.send(JSON.stringify(payload)) // avisa a esse cliente que ele perdeu o jogo
                                    }
                                })
                            }
                        })
                    }
                    if(game.playTwo === result.clientID){ // caso o jogador seja o play2
                        const payload = {
                            'method' : "Winner"
                        }
                        connection.send(JSON.stringify(payload)) // avisa que ele ganhou o jogo
                        clients.forEach((client) =>{
                            if(client.clientID === game.playOne){ // acha o perdedor
                                wsServer.connections.forEach((Connection) =>{
                                    if(Connection === client.connection){ // acha a conexão
                                        const payload = {
                                            'method' : "Loser"
                                        }
                                        Connection.send(JSON.stringify(payload)) // avisa a esse cliente que ele perdeu o jogo
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }

        // vez do jogador
        if(result.method === "playChance"){
            const gameID = result.gameID;
            games.forEach(game => { // busca o oponente
                if(game.id === gameID){ // acha o jogo
                    if(result.clientID === game.playOne){ // caso o player seja o play1
                        const payload = {
                            'method' : "playChance",
                            'tiro' : null
                        }
                        connection.send(JSON.stringify(payload)) // avisa ao play1 que é a sua vez
                        clients.forEach((client)=>{ // busca o oponente
                            if(client.clientID === game.playTwo){
                                wsServer.connections.forEach((Connection) =>{
                                    if(Connection === client.connection){ // acha a conexão
                                        const payload = {
                                            'method' : "oponenteChance",
                                            'tiro' : result.tiro
                                        }
                                        Connection.send(JSON.stringify(payload)) // avisa ao play2 que é a vez de seu oponente
                                    }
                                })
                            }
                        })
                    }
                    if(result.clientID === game.playTwo){ // acha ele mesmo 
                        const payload = {
                            'method' : "playChance",
                            'tiro' : null
                        }
                        connection.send(JSON.stringify(payload)) // avisa ao play2 que é a sua vez
                        clients.forEach((client)=>{ // busca o oponente
                            if(client.clientID === game.playOne){ // acha o oponente
                                wsServer.connections.forEach((Connection) =>{
                                    if(Connection === client.connection){ // acha a conexão
                                        const payload = {
                                            'method' : "oponenteChance",
                                            'tiro' : result.tiro
                                        }
                                        Connection.send(JSON.stringify(payload)) // avisa ao play2 que é a vez de seu oponente
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }

        // vez do oponente
        if(result.method === "oponenteChance"){
            const gameID = result.gameID;
            games.forEach(game => { // busca o oponente
                if(game.id === gameID){ // acha o jogo
                    if(result.clientID === game.playOne){ // caso o player seja o play1
                        const payload = {
                            'method' : "oponenteChance",
                            'tiro' : null
                        }
                        connection.send(JSON.stringify(payload)) //  avisa ao player que agora é a vez de seu oponente
                        clients.forEach((client)=>{ 
                            if(client.clientID === game.playTwo){// busca nos clientes pelo play2
                                wsServer.connections.forEach((Connection) =>{
                                    if(Connection === client.connection){ // acha a conexão
                                        const payload = {
                                            'method' : "playChance",
                                            'tiro' : result.tiro
                                        }
                                        Connection.send(JSON.stringify(payload)) // avisa ao play2 que é a sua vez
                                    }
                                })
                            }
                        })
                    }
                    if(result.clientID === game.playTwo){ // caso o player seja o play2
                        const payload = {
                            'method' : "oponenteChance",
                            'tiro' : null
                        }
                        connection.send(JSON.stringify(payload)) //  avisa ao player que agora é a vez de seu oponente
                        clients.forEach((client)=>{ 
                            if(client.clientID === game.playOne){// busca nos clientes pelo play1
                                wsServer.connections.forEach((Connection) =>{
                                    if(Connection === client.connection){ // acha a conexão
                                        const payload = {
                                            'method' : "playChance",
                                            'tiro' : result.tiro
                                        }
                                        Connection.send(JSON.stringify(payload)) // avisa ao play1 que é a sua vez
                                    }
                                })
                            }
                        })
                    }
                }
            })                   
        }

        // iniciar o jogo
        if(result.method === "InitGame"){ // play1 sempre começa
            games.forEach((game) =>{
                if(game.id === result.gameID){ // acha o jogo 
                    clients.forEach((client) =>{
                        if(client.clientID === game.playOne){ // caso o cliente seja o play1
                            wsServer.connections.forEach((Connection) =>{
                                if(Connection === client.connection){ // acha a conexão
                                    const payload = {
                                        'method' : "playChance",
                                        'tiro' : null
                                    }
                                    Connection.send(JSON.stringify(payload)) // avisa que ele começa o jogo
                                }
                            })
                        }
                        if(client.clientID === game.playTwo){ // caso o cliente que é o play2
                            wsServer.connections.forEach((Connection) =>{
                                if(Connection === client.connection){ // acha a conexão
                                    const payload = {
                                        'method' : "oponenteChance",
                                        'tiro' : null
                                    }
                                    Connection.send(JSON.stringify(payload)) // avisa que é a vez de seu oponente
                                }
                            })
                        }
                    })
                }
            })
        }


        if(result.method === "ready"){
            if(play1 === null){ // player1 escolhido
                play1 = result.clientID
                map1 = result.map
            }else{
                play2 = result.clientID
                map2 = result.map
            }
            if(play1 !== null && play2 !== null){
                CreateGame()
            }
        }
    });

    // gerar um clientID
    const clientID = guid();
    clients.add({
        "connection": connection,
        "clientID": clientID,
        'number': numClients
    });

    const payLoad = {
        'method' : "connect",
        'clientID': clientID,
        'number': numClients
    }

    connection.send(JSON.stringify(payLoad));
})

function S4(){
    return (((1+Math.random())*0x10000)|0).toString(16).substring(-4);
}

const guid = () => (S4() + S4() + "-" + S4());

function CreateGame(){
    gameID = guid();
    games.add({
        'id': gameID,
        'playOne': play1,
        'playTwo': play2
    })
    const regex = /--/g;
    const mapaPlay1 = map1.split(regex);
    const mapaPlay2 = map2.split(regex);  
    clients.forEach((client) =>{
        if(client.clientID === play1){
            wsServer.connections.forEach((Connection) =>{
                if(Connection === client.connection){    
                    const payload = {
                        'method' : "MapOponente",
                        'map': mapaPlay2,
                        'gameID' : gameID
                    }
                    Connection.send(JSON.stringify(payload))
                }
            })
        }
        if(client.clientID === play2){
            wsServer.connections.forEach((Connection) =>{
                if(Connection === client.connection){    
                    const payload = {
                        'method' : "MapOponente",
                        'map': mapaPlay1,
                        'gameID' : gameID
                    }
                    Connection.send(JSON.stringify(payload))
                }
            })
        }
    })
    play1 = null;
    play2 = null;
}