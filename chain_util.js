const Ec = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
let idv1 = require('uuid/v1');


const ec = new Ec('secp256k1');

class chain_util{
    static genKeyPair(){
       return ec.genKeyPair();
    }

    static id(){
        return idv1();
    }

    static Hash(data){
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifysignature(publicKey, signature, DataHash){
        return ec.keyFromPublic(publicKey, 'hex').verify(DataHash, signature);
    }
}

module.exports = chain_util;