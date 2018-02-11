let p2p = require('p2p');
let Blockchain = require('./blockchain');
let Block = require('./block');
let blockchain = new Blockchain();
class peers{
	constructor(host, port, peerHost, peerPort){
		this.host = host;
		this.port = port;
		this.peerHost = peerHost;
		this.peerPort = peerPort;
		this.peer = p2p.peer({
			host: this.host,
			port: this.port,
			wheelKnownPeers: { host: this.peerHost, port: this.peerPort },
			serviceInterval: '10s'
		});
		console.log(this.peer.status());
	}

	syncBlock(){
		this.peer.remote({
			host: this.peerHost,
			port: this.peerPort
		}).run('handle/sync', { sync: blockchain.getLatestBlock() }, (err, result) => {
			if(blockchain.getLatestBlock().timestamp < result.timestamp){
				blockchain.addBlock(new Block(result.timestamp, result.pendingTransactions, result.getLatestBlock.hash));
				console.log("new block added");
			}
		})
	}

	getRequests(){
		this.peer.handle.sync = (payload, done, err) => {
			if (payload.timestamp < blockchain.getLatestBlock().timestamp){
				return (blockchain.getLatestBlock());
			} 
			if (err) {
			  return done(err);
			}
			done(null);
		  };
	}
}

module.exports = peers;