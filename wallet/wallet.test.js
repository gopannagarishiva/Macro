Wallet = require('./Wallet');
TransactionPool = require('./Transaction_pool');
BlockChain = require('../Block_chain/Block_chain');
const { IntialBalence } = require('../config');

describe('Wallet_', () => {
    let wallet,transactionPool;

    beforeEach(() => {
        wallet = new Wallet();
        transactionPool = new TransactionPool();
    });

    describe('creating a transaction', () => {
        let recipient, amount, transaction, bc;
        
        beforeEach(() => {
            recipient = 'fgfgfghjk09';
            amount = 100;
            bc = new BlockChain();
            transaction = wallet.createTransaction(recipient, amount, transactionPool, bc);     
        });

        describe('and doing same transaction', () => {

            beforeEach(() => {
                wallet.createTransaction(recipient, amount, transactionPool, bc);
            });

            it('double the send amount substracted from the wallet balence', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balence - amount * 2);
            });

            it('clones the `sendamount` output for the recipient', () => {
                expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([amount, amount]);
            });
        });
    });

    describe('calculating a balence', () =>{
        let senderWallet, recipientWallent, sendAmount, repeat, bc;

        beforeEach(() => {
            senderWallet = new Wallet();
            recipientWallent = new Wallet();
            bc = new BlockChain();
            sendAmount = 100;
            repeat = 3;

            for(let i=0; i<repeat; i++){
                senderWallet.createTransaction(recipientWallent.publicKey, sendAmount, transactionPool, bc);
            }
            bc.addBlock(transactionPool.Pool);
        });

        it('calculating the balence from blockChain matching the sender side', () => {
            expect(senderWallet.calculateBalence(bc)).toEqual(IntialBalence - (sendAmount * repeat) );
        });
        it('calculating the balence from blockChain matching the sender side', () => {
            expect(recipientWallent.calculateBalence(bc)).toEqual(IntialBalence + (sendAmount * repeat) );
        });
    });
});