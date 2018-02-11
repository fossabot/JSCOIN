let Peer = require('p2p-node').Peer;
let Blockchain = require('./blockchain');
let Block = require('./block');
let blockchain = new Blockchain();
class peers{
	constructor(host){
		this.host = host;	
		let p2p = new Peer(this.host);
	}

	syncBlock(){
		this.p2p.on('connect', function(d){
			console.log("i'm connected");
		});
	}

	getRequests(){
		this.peer.handle.sync = (payload, done) => {
			/*if (payload < blockchain.getLatestBlock()){
				console.log("send new blocks");				
				return (blockchain.getLatestBlock());
			} else if (payload > blockchain.getLatestBlock()){
				blockchain.addBlock(new Block(payload));
				console.log("new block added");
				return (blockchain.getLatestBlock());
			} */
			return (blockchain.getLatestBlock());
			console.log("Blocks Sync....")
		  };
	}
}

module.exports = peers;