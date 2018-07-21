const Transaction = require('./wallet/Transaction');
const Wallet = require('./wallet/Wallet');

class mine{
    constructor(blockChain, transactionPool, wallet, p2pServer){
        this.blockChain = blockChain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine(){
        const validTransactions = this.transactionPool.validTransactions();
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockChainWallet()));
        const block = this.blockChain.addBlock(validTransactions);
        this.p2pServer.syncChain();
        this.transactionPool.clear();
        this.p2pServer.broadcastClearTransaction();

        return block;
    }
}

module.exports = mine;