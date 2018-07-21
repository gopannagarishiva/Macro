const Block = require('./Block');
const  { Difficulty }  = require('../config')

describe('Block', () =>{
    let data = 'Testing';
    let lastblock = Block.genesis();
    let block = Block.mineBlock(lastblock, data);

    it('generates the hash that matches with the difficulty:', () =>{
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(count = block.difficulty));
        console.log(block);
    });

    it('Dynamic Difficulty testing: ', () => {
        expect(Block.adjustDifficulty(block, block.time)).toEqual(block.difficulty + 1);

    });

    it('Dynamic Difficulty testing: ', () => {
        expect(Block.adjustDifficulty(block, block.time+600000)).toEqual(block.difficulty - 1);

    });
});