const Transaction = require('./Transaction');
const Wallet = require('./Wallet');
const {MINING_REWARD} = require('../config');

describe('Transaction', () => {
    let wallet, recipient, amount, transaction;
    beforeEach(() =>{
        wallet = new Wallet();
        recipient = 'f-fasbh45';
        amount = 100;
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('outputs the `amount` substracted from the wallet balence', () => {
        expect(transaction.outputs.find( output => output.address === wallet.publicKey).amount).toEqual(wallet.balence-amount);
    });

    it('outputs the `amount` added to the recipient', () => {
        expect(transaction.outputs.find( output => output.address === recipient).amount).toEqual(amount);
    });

    it('inputs the balence of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balence);
    });

    it('validates the vaild transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });
    
    it('Invalidates the corrupt transaction', () => {
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    
describe('updating Transaction_', () => {
    let nextAmount, nextRecipient;

    beforeEach(() => {
        nextAmount = 50;
        nextRecipient = 'f_7876hag8';
        transaction = transaction.updateTransaction(wallet, nextRecipient, nextAmount);
    });

    it('subtracting the amounnt from senders output', () =>{
        expect(transaction.outputs.find( output => output.address === wallet.publicKey).amount).toEqual(wallet.balence - amount -nextAmount);
    });

    it('outputs an amount for next recipient', () => {
        expect(transaction.outputs.find( output => output.address === nextRecipient).amount).toEqual(nextAmount);
    });
});

});

describe('Transaction that excceds the balence', () => {
    let wallet, recipient, amount, transaction;
    beforeEach(() =>{
        wallet = new Wallet();
        recipient = 'f-fasbh45';
        amount = 10000;
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('sending amount exceeds the current balence', () => {
        expect(transaction).toEqual(undefined);
    });
    describe('Testing reward transaction', () => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockChainWallet());
        });

        it(`reward's the miners wallet`, () => {
            expect(transaction.outputs.find(t => t.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
        });
    });
});
