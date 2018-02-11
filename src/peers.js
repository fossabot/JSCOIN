let p2p = require('p2p');
let Blockchain = require('./blockchain');
let Block = require('./block');
let blockchain = new Blockchain();
class peers{
	constructor(host, port){
		this.host = host;
		this.port = port;
		this.peer = p2p.peer({
			host: this.host,
			port: this.port
		});
		console.log(this.peer.status());
	}

	syncBlock(){
		this.peer.remote({
			host: this.host,
			port: this.port
		}).run('handle/sync', { sync: blockchain.getLatestBlock() }, (err, result) => {
			if(blockchain.getLatestBlock().timestamp < result.timestamp){
				blockchain.addBlock(new Block(result));
				console.log("new block added");
			}
		})
	}

	getRequests(){
		this.peer.handle.sync = (payload, done) => {
			if (payload.timestamp < blockchain.getLatestBlock().timestamp){
				console.log("send new blocks");				
				return (blockchain.getLatestBlock());
			} else if (payload.timestamp > blockchain.getLatestBlock().timestamp){
				blockchain.addBlock(new Block(payload));
				console.log("new block added");
				return (blockchain.getLatestBlock());
			}
			console.log("Blocks Sync....")
		  };
	}
}

module.exports = peers;