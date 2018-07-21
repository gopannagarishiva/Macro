Transaction = require('./Transaction');
Wallet = require('./Wallet');
Transaction_Pool = require('./Transaction_pool');
BlockChian = require('../Block_chain/Block_chain');

describe('TransactionPool', () => {
    let transaction, wallet, transaction_pool, bc;

    beforeEach(() => {
        wallet = new Wallet();
        transaction_pool = new Transaction_Pool();
        bc = new BlockChian();
        //transaction = Transaction.newTransaction(wallet, 'fxcvbn789', 50);
        //transaction_pool.UpdateOrAddTransaction(transaction);
        transaction = wallet.createTransaction('rfgh-e583967', 50, transaction_pool, bc);
    });

    it('adds a transaction to the pool', () => {
        expect(transaction_pool.Pool.find(key => key.id === transaction.id)).toEqual(transaction);
    });

    it('updates a transaction in the pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.updateTransaction(wallet, 'ghuii809', 100);
        transaction_pool.UpdateOrAddTransaction(newTransaction);
        expect(JSON.stringify(transaction_pool.Pool.find(key => key.id === newTransaction.id))).not.toEqual(oldTransaction);
    });

    it('clearing the trasaction pool', () => {
        transaction_pool.clear();
        expect(transaction_pool.Pool).toEqual([]);
    });

    describe('mixing valid and Invalid transactions', () => {
        let validTransactions;
        beforeEach(() => {
            validTransactions = [...transaction_pool.Pool];

            for(let i=0; i<6; i++){
                wallet = new Wallet();
                transaction = wallet.createTransaction('n-fdsghshs', 50, transaction_pool, bc);
                if(i%2 == 0){
                    transaction.input.amount = 10000;
                }else{
                    validTransactions.push(transaction);

                }
            }
        });

        it('shows the different between the valid and the corrupt transactions', () => {
            expect(transaction_pool.Pool).not.toEqual(validTransactions);
        });

        it('grabs the valid transactions', () => {
            expect(transaction_pool.validTransactions()).toEqual(validTransactions);

        });

    });
});