const chain_util = require('../chain_util');
const { Difficulty, Minerate } = require('../config');

class Block{
    constructor(time, lasthash, hash, Nonce, difficulty, data){
        this.time = time;
        this.lasthash = lasthash;
        this.hash = hash;
        this. Nonce = Nonce;
        this.difficulty = difficulty || Difficulty;
        this.data = data;

    }

    toString(){
        console.log(`Block_
        Time       :${this.time}
        LastHash   :${this.lasthash}
        Hash       :${this.hash}
        Nonce      :${this.Nonce}
        Difficulty :${this.difficulty}
        Data       :${this.data}`);
    }

    static genesis(){
        var lasthash = '-------'
        var hash = Block.hashgen('57657678', lasthash, 0, Difficulty, [])
        return new this('57657678', lasthash, hash, 0, Difficulty, []);
    }

    static mineBlock(lastBlock, data){
        var Nonce = 0;
        var date, hash;
        var lasthash = lastBlock.hash;
        let {difficulty} = lastBlock;
        do{
            Nonce++;
            date = Date.now()
            difficulty = Block.adjustDifficulty(lastBlock, date);
            hash = Block.hashgen(date, lasthash, Nonce, difficulty, data);
        }while( hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this(date, lasthash, hash, Nonce, difficulty, data);
    }

    static hashgen(date, lasthash, nonce, difficulty, data){
        return chain_util.Hash(`${date}${lasthash}${data}${nonce}${difficulty}`).toString();
    }

    static adjustDifficulty(lastBlock, currenttime){
        let { difficulty } = lastBlock;
        difficulty = lastBlock.time + Minerate > currenttime ? difficulty + 1 : difficulty -1;
        return difficulty;
    }
}

module.exports = Block;