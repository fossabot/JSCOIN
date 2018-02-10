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
		if (this.pendingTransactions <= 0){
			console.log('\x1b[31m', 'No pending transactions', '\x1b[0m');
			return false;
		}
		let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock.hash);
		block.mineBlock(this.difficulty);
		console.log("block successfully mined");
		this.chain.push(block);

		this.pendingTransactions = [
			new Transaction(null, miningRewardAddress, this.miningReward)
		];
	}

	createTransaction(transaction){
		//if (this.getBalanceOfAddress(transaction.fromAddress) <= 0){
		//	console.log("\x1b[31m", 'No enought coins of from address', "\x1b[0m");
		//	return false;
		//}
		this.pendingTransactions.push(transaction);
		console.log("Transaction success");
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (currentBlock.hash !== currentBlock.calculateHash()) {
				console.log('\x1b[31m', 'Current block hash is invalid', '\x1b[0m');
				return false;
			}

			if (currentBlock.previousHash !== previousBlock.hash) {
				console.log('\x1b[31m', 'Previous block hash is invalid', '\x1b[0m');
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

module.exports = Blockchain;
