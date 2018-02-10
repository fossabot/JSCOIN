let Blockchain = require('./src/blockchain');
let Transaction = require('./src/transactions');
let block = require('./src/block');
let Wallet = require('./src/wallet');
var program = require('commander');
let jscoin = new Blockchain();
let wallet = new Wallet();
wallet.initWallet();
program
	.usage('[options] <file ...>')
	.version('0.1.0')
	.option('wallet', "show public and private key")	
	.option('mining', 'Mine new blocks')
	.option('pending', 'Show pending transactions')
	.option('send [receiver, amount]', 'specify receiver and amount to send')
	.parse(process.argv);

if (program.mining){
	while(jscoin.pendingTransactions > 0){
		jscoin.minePendingTransactions(wallet.getPublicFromWallet());
	}
	console.log('\x1b[31m', 'No more pending transactions', '\x1b[0m');	
}

if (program.pending){
	if(jscoin.pendingTransactions > 0){
		console.log(jscoin.pendingTransactions);
	} else {
		console.log('\x1b[31m', 'No pending transactions', '\x1b[0m');	
	}
}

if(program.create){
	wallet.initWallet();
}

if(program.send){
	jscoin.createTransaction(new Transaction(
		wallet.getPublicFromWallet, 
		program.send[0], 
		program.send[1]
	));
}

if(program.wallet){
	console.log("Your address:     ", wallet.getPublicFromWallet());
	console.log('Your private key: ', wallet.getPrivateFromWallet());	
}