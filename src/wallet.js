let EC = require('elliptic').ec;
let fs = require('fs');
const ec = new EC('secp256k1');
let privateKeyLocation = './wallet/private_key';
class Wallet{

	generatePrivateKey() {
		const KeyPair = ec.genKeyPair();
		const PrivateKey = KeyPair.getPrivate();
		return PrivateKey.toString(16);
	}

	initWallet() {
		if (!fs.existsSync('./wallet')){
			fs.mkdirSync('./wallet');
		}
		if (fs.existsSync(privateKeyLocation)) {
			return;
		}
		const newPrivateKey = this.generatePrivateKey();
		fs.writeFileSync(privateKeyLocation, newPrivateKey);
		console.log('new wallet with private key created');
	}

	getPrivateFromWallet() {
		const buffer = fs.readFileSync(privateKeyLocation, 'utf8');
		return buffer.toString();
	}

	getPublicFromWallet() {
		const privateKey = this.getPrivateFromWallet();
    	const key = ec.keyFromPrivate(privateKey, 'hex');
		return key.getPublic().encode('hex');
	}
}

module.exports = Wallet;