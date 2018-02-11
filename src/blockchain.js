let Block = require ('./block');
let Transaction = require ('./transactions');
class Blockchain {
	constructor(chain) {
		if(chain === undefined){
			this.chain = [this.createGenesisBlock()];
		} else {
			this.chain = chain;
		}
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock() {
		return new Block(Date.parse("06/02/2018"), [{ fromAddress: '', 
													toAddress: '0478f5fc487a05e3d189f5970249c9a0a1e4722f55b506296d6aeec5e4f6084967f8f7fcbca0c69f8061f4f6dd6bff4917a98db7f0db7c4f1fcf801201a4d3a874', 
													amount: 1000 }], "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(block) {
		this.chain.push(block);
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
		if (this.getBalanceOfAddress(transaction.fromAddress) <= 0){
			console.log("\x1b[31m", 'No enought coins of from address', "\x1b[0m");
			return false;
		}
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
