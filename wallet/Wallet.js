const { IntialBalence } = require('../config')
const chain_util = require('../chain_util');
const Transaction = require('./Transaction');

class Wallet{
    constructor(){
        this.balence = IntialBalence;
        this.keyPair = chain_util.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString(){
        console.log(` Wallet__ 
        PublicKey : ${this.publicKey}
        Balence   : ${this.balence} `);
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, transactionPool, blockChain){
        if(amount > this.balence){
            console(`amount: ${amount} exceeds the balence`);
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if(transaction){
            transaction.updateTransaction(this, recipient, amount);
        }else{
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.Pool.push(transaction);
        }
        this.balence = this.calculateBalence(blockChain);

        return transaction;
    }

    static blockChainWallet(){
        const blockChainWallet = new this();
        blockChainWallet.publicKey = 'Block_chain_Wallet';
        return blockChainWallet;
    }

    calculateBalence(blockChain){
        let balence = this.balence;
        let transactions = [];
        blockChain.chain.forEach(block => block.data.forEach(transaction => {
            transactions.push(transaction)
        }));
        const walletInputTs = transactions.filter(transaction => transaction.input.publicKey === this.publicKey);
        let startTime = 0;

        if(walletInputTs.length > 0){
            const recentInputT = walletInputTs.reduce(
                (prev, cur) => prev.input.timestamp > cur.input.timestamp ? prev : cur
            );

            balence = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
            startTime = recentInputT.input.timestamp;
        }

        transactions.forEach(transaction => {
            if(transaction.input.timestamp > startTime){
                transaction.outputs.find(output => {
                    if(output.address === this.publicKey){
                        balence += parseInt(output.amount);
                    }
                });
            }
        });

        return balence;

    }
}

module.exports = Wallet;