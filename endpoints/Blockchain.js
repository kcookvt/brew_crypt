// Import modules
const SHA512 = require("crypto-js/sha512");
var readline = require('readline-sync');
var Block = require('./Block.js');
var Transaction = require('./Transactions.js');


module.exports = class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 10;
    }

    createGenesisBlock() {
        var today = new Date();
        return new Block(today.toLocaleDateString('en-US'), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    getAllBlocks() {
        return this.chain;
    }

    findBlock() {
        var blockinput = readline.question('Enter the block timestamp to return information on it - ');
        return this.chain[blockinput];
    }

    minePendingTransactions(miningRewardAddress) {
        var today = new Date();
        let block = new Block(today.toLocaleDateString('en-US'), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(block1, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}