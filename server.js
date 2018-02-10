let Blockchain = require('./src/blockchain');
let Transaction = require('./src/transactions');
let block = require('./src/block');
let Wallet = require('./src/wallet');
var program = require('commander');
let jscoin = new Blockchain();
let wallet = new Wallet();
wallet.initWallet();
program
	.usage('[command] <file ...>')
	.version('0.1.0')
	.command('address', "Create new wallet with label")	
	.command('mining', 'Mine new blocks')
	.command('transactions', 'Show latests transactions')
	.command('send [receiver, amount]', 'specify receiver and amount to send')
	.parse(process.argv);

if (program.command('mining')){
	while(jscoin.pendingTransactions > 0){
		jscoin.minePendingTransactions(wallet.getPublicFromWallet());
	}
	console.log('\x1b[31m', 'No more pending transactions', '\x1b[0m');	
}

if(program.command('create')){
	wallet.initWallet();
}