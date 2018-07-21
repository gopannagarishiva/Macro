const Block = require('./Block');

class Block_chain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock(data){
        var lastBlock = this.chain[this.chain.length-1];
        var currentBlock = Block.mineBlock(lastBlock, data);
        this.chain.push(currentBlock);
        return currentBlock;
    }

    isValidchain(chain){

        if(JSON.stringify(Block.genesis()) !== JSON.stringify(chain[0])){
            return false;
        }
        for(var i=1; i<chain.length; i++){
            var lastBlock = chain[i-1];
            var block = chain[i];
            if( lastBlock.hash != block.lasthash) return false; 
        }
        return true;
    }

    replacechain(Newchain){
        if(Newchain.length <= this.chain.length){
            console.log('New chain is no longer than current chain');
            return false;
        }

        if(!this.isValidchain(Newchain)){
            console.log('Chain is not valid');
            return false;
        }
        this.chain = Newchain;
    }
}

module.exports = Block_chain;