const P2pServer = require('ws');

var P2PPORT = process.env.P2PPORT || 5000;
var PEERS = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPE = {
    chain : 'chain', 
    transaction : 'transaction',
    clearTransaction : 'clearTransaction'};

class P2PSERVER{
    constructor(BlockChain, TransactionPool){
        this.BlockChain = BlockChain;
        this.TransactionPool = TransactionPool;
        this.socket = [];
    }

    listen(){
        const server = new P2pServer.Server({ port : P2PPORT});
        server.on('connection', socket => this.connectToSocket(socket));
        console.log(`listening to peer to peer server on port:${P2PPORT}`)
        this.connectTopeers();
    }

    connectTopeers(){
        PEERS.forEach( peer => {
            const socket = new P2pServer(peer);
            socket.on('open', () => this.connectToSocket(socket));
        });
    }

    connectToSocket(socket){
        this.socket.push(socket);
        console.log('socket is connected');
        this.messageHandler(socket);
        this.sendChain(socket);
    }

    sendChain(socket){
        socket.send(JSON.stringify({
            type : MESSAGE_TYPE.chain,
            chain: this.BlockChain.chain}));
    }

    sendTransaction(socket, transaction){
        socket.send(JSON.stringify({
            type : MESSAGE_TYPE.transaction,
            transaction
        }));
    }

    messageHandler(socket){
        socket.on('message', message => {
            const data = JSON.parse(message);
            switch(data.type){
                case MESSAGE_TYPE.chain:
                    this.BlockChain.replacechain(data.chain);
                    break;
                case MESSAGE_TYPE.transaction:
                    this.TransactionPool.UpdateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPE.clearTransaction:
                    this.TransactionPool.clear();
                    break;

            }
        });
    }

    syncChain(){
        this.socket.forEach(peer => this.sendChain(peer));
    }

    broadcastTransaction(transaction){
        this.socket.forEach(peer => this.sendTransaction(peer, transaction));
    }

    broadcastClearTransaction(){
        this.socket.forEach(peer => peer.send(JSON.stringify({
            type : MESSAGE_TYPE.clearTransaction
        })));
    }

}

module.exports = P2PSERVER;