
const express = require('express');
const http = require('http');



const clients = require('./models/model_client.cjs');


const app = express()
const server = http.createServer(app)


app.use(express.static('public'))



const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: process.env.PORT || 1234
});

class Logic {
    constructor() {
        this.ok = 1
        this.sockets = [];
    }
    addClient(socket, req) {

        var new_client = new clients.Clients(this, socket, req.socket.remoteAddress);
        new_client.ping(socket, this.sockets, this.desconect);
        this.sockets.push(new_client);
    }
    desconect(socket, list) {
        socket.close();

        for (var i = 0; i < list.length; i++) {
            if (list[i].socket === socket) {
                list.splice(i, 1);
                i--;
            }
        }
    }

}
const logic = new Logic()

app.get('/o', (req, res) => {
    res.send({ "qtd_clients": logic.sockets.length })
});

wss.on('connection', function (socket, req) {
    console.log("dd")
    logic.addClient(socket, req)
    // Adicionamos cada nova conexão/socket ao array `sockets`
    //console.log("conect ", req.socket.remoteAddress, logic.sockets.length);
    // Quando você receber uma mensagem, enviamos ela para todos os sockets

    socket.on("error", (reason) => {
        console.log("loss conection", reason);
    });
    socket.on("disconnect", (reason) => {
        console.log("loss conection");
    });
    // Quando a conexão de um socket é fechada/disconectada, removemos o socket do array
    socket.on('close', function () {
        socket.close();
        //desconect(socket, sockets)
    });
});

server.listen(1235, () => {
    console.log(`> Server listening on port: 1234`)
})
/*
server.listen(function listening() {
    console.log(server.address().port)
    //
    // If the `rejectUnauthorized` option is not `false`, the server certificate
    // is verified against a list of well-known CAs. An 'error' event is emitted
    // if verification fails.
    //
    // The certificate used in this example is self-signed so `rejectUnauthorized`
    // is set to `false`.
    //
    const ws = new WebSocket(`wss://192.168.100.72:1234`, {
        rejectUnauthorized: false
    });

    ws.on('open', function open() {
        ws.send(JSON.stringify(JSON.parse('{"id":"msn","msg":"ola"}')));
    });
});
*/