var express = require('express');
var router = express.Router();
var BlockChain = require('../Block_chain/Block_chain');
var bodyParser = require('body-parser');
var P2p_server = require('../socket_server/P2p_server');
var mine = require('../mine');

const TransactionPool = require('../wallet/Transaction_pool');
const Wallet = require('../wallet/Wallet');

bc = new BlockChain();
router.use(bodyParser.json());
let wallet = new Wallet();
let transactionPool = new TransactionPool();
socket = new P2p_server(bc, transactionPool);
miner = new mine(bc, transactionPool, wallet, socket);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('view', { data: JSON.parse(JSON.stringify(bc.chain)) });
});

router.get('/add', (req, res) => {
  res.render('add');
});

router.post('/add', (req, res) => {
  var block = bc.addBlock(req.body.data);
  socket.syncChain();
  res.redirect('/add');
});

router.get('/transactions', (req, res) => {
  res.render('transactions', { data : JSON.stringify(transactionPool.Pool) });
});

router.get('/transact', (req, res) => {
  res.render('transact');
});

router.post('/transact', (req, res) => {
  let {recipient, amount} = req.body;
  let transaction = wallet.createTransaction(recipient, amount, transactionPool, bc);
  socket.broadcastTransaction(transaction);
  res.redirect('/transact');
});

router.get('/minetransaction', (req, res) => {
  if(transactionPool.Pool.length > 0){
    let block = miner.mine();
    //console.log(`block_transaction: ${JSON.parse(block)} `);
    res.redirect('/');
  }
});

router.get('/publicKey', (req, res) => {
  res.render('publicKey', { data : JSON.stringify(wallet.publicKey)});
});

router.get('/balence', (req, res) => {
  let balence = wallet.calculateBalence(bc);
  res.render('balence', { data : JSON.stringify(balence)});
});


socket.listen();

module.exports = router;
