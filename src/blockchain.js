let Block = require ('./block');
let Transaction = require ('./transactions');
class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock() {
		return new Block("06/02/2018", "Genesis block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress){
		let block = new Block(Date.now(), this.pendingTransactions, this.getLastestBlock().hash);
		block.mineBlock(this.difficulty);

		console.log("block successfully mined");
		this.chain.push(block);

		this.pendingTransactions = [
			new Transaction(null, miningRewardAddress, this.miningReward)
		];
	}

	createTransaction(transaction){
		this.pendingTransactions.push(transaction);
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

	getBalanceOfAddress(address){
		let balance  = 0;

		for(const block of this.chain) {
			for(const trans of block.transactions){
				if(trans.fromAddress === address){
					balance -= trans.amount;
				}

				if (trans.toAddress === address){
					balance += trans.amount;
				}
			}
		}
		return balance;
	}


}

module.exports = Blockchain
