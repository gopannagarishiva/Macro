const chain_util = require('../chain_util');
const { MINING_REWARD } = require('../config');

class Transaction{
    constructor(){
        this.id = chain_util.id();
        this.input = null;
        this.outputs = [];
    }

    updateTransaction(sendersWallet, recipient, amount){
        let sendersOutput = this.outputs.find( output => output.address === sendersWallet.publicKey);
        if(sendersOutput.amount < amount){
            console.log(`Amount: ${amount} exceeds the balence `);
            return;
        }

        sendersOutput.amount = sendersOutput.amount - amount;
        this.outputs.push({ amount, address : recipient});
        Transaction.signTransaction(this, sendersWallet);
        return this;
    }

    static transactionWithOutput(senderWallet, output){
        let transaction = new this();
        transaction.outputs.push(...output);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction; 
    }

    static newTransaction(sendersWallet, recipient, amount){
        if(sendersWallet.balence < amount){
            console.log(`Amount: ${amount} exceeds the balence`);
            return;
        }
        return Transaction.transactionWithOutput(sendersWallet,
            [{ amount:sendersWallet.balence-amount, address: sendersWallet.publicKey},
            { amount, address: recipient}]);
    }

    static rewardTransaction(minerWallet, blockChainWallet){
        return Transaction.transactionWithOutput(blockChainWallet, [{
            amount: MINING_REWARD, address: minerWallet.publicKey
        }]);
    }

    static signTransaction(transaction, senderWallet){
        transaction.input = {
            timestamp : Date.now(),
            amount : senderWallet.balence,
            publicKey : senderWallet.publicKey,//address
            signature : senderWallet.sign(chain_util.Hash(transaction.outputs))
        };
    }

    static verifyTransaction(transaction){
        return chain_util.verifysignature(transaction.input.publicKey, transaction.input.signature, chain_util.Hash(transaction.outputs));
    }
}

module.exports = Transaction;