const Transaction = require('./Transaction');

class Transaction_pool{
    constructor(){
        this.Pool = [];
    }

    UpdateOrAddTransaction(transaction){
        let TransactionWithId = this.Pool.find(t => t.id === transaction.id);
        if(TransactionWithId){
            this.Pool[this.Pool.indexOf(TransactionWithId)] = transaction;
        }else{
            this.Pool.push(transaction);
        }
    }

    existingTransaction(address){
        return this.Pool.find(t => t.input.publicKey === address);
    }

    validTransactions(){
        return this.Pool.filter( transaction => {
            const outputTotal = transaction.outputs.reduce((total, output) => {
                console.log(`total= ${total}`);
                console.log(`output= ${output.amount}`);
                 return parseInt(total) + parseInt(output.amount);
            }, 0);

            console.log(parseInt(outputTotal));

            if(transaction.input.amount !== outputTotal){
                console.log(`Invalid transactions from : ${transaction.input.publicKey}`);
                return;
            }

            if(!Transaction.verifyTransaction(transaction)){
                console.log(`Invalid signature from : ${transaction.input.publicKey}`);
                return;
            }

            return transaction;
        });
    }
    clear(){
        this.Pool = [];
    }
}

module.exports = Transaction_pool;