
class Clients {



    constructor(root, socket, ip) {
        this.root = root;
        this.socket = socket;
        this.ipp = ip
        this.mac = null;
        this.ssid = null;
        socket.on('message', (msg) => this.chamados(msg));
    }
    chamados(msg) {
        console.log('recebido: ', JSON.parse(msg));
        this.root.sockets.forEach(s => s.socket.send(JSON.stringify(JSON.parse(msg))));
    }
    ping(socket, list, desc) {

        socket.pingssent = 0;
        var interval = setInterval(() => {
            if (socket.pingssent >= 1) {// how many missed pings you will tolerate before assuming connection broken.
                console.log("desconect ", this.ipp);
                desc(socket, list)
                socket.close();
                clearInterval(interval);
            } else {
                socket.ping();
                socket.pingssent++;
            }
        }, 1.5 * 1000);
        socket.on("pong", function () { // we received a pong from the client.
            socket.pingssent = 0; // reset ping counter.
        });
    }
}
module.exports = { Clients }