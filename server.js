let Blockchain = require('./src/blockchain');
let Transaction = require('./src/transactions');
let p2p = require('./src/peers');
let block = require('./src/block');
let Wallet = require('./src/wallet');
var program = require('commander');
let wallet = new Wallet();
let jscoin = new Blockchain(peers.syncBlock());
let peers = new p2p('51.15.192.98');
wallet.initWallet();
peers.syncBlock();
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
		wallet.getPublicFromWallet(), 
		program.send[0], 
		program.send[1]
	));
	jscoin.minePendingTransactions(wallet.getPublicFromWallet());
}

if(program.wallet){
	console.log("Your address:     ", wallet.getPublicFromWallet());
	console.log('Your private key: ', wallet.getPrivateFromWallet());	
	console.log('Balance: ', jscoin.getBalanceOfAddress(wallet.getPublicFromWallet()));
}
