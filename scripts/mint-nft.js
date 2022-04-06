require("dotenv").config()
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")

const web3 = createAlchemyWeb3(process.env.API_URL)
const contractAddress = '0x5ACd8ACE19e89a67CdE689f3A9DA878BCDB11204';
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(process.env.PUBLIC_KEY);
  
  const data = nftContract.methods
    .mintNFT(process.env.PUBLIC_KEY, tokenURI)
    .encodeABI();

  const gas = await web3.eth.estimateGas({
    data,
    to: contractAddress,
    from: process.env.PUBLIC_KEY,
  })

  const tx = {
    gas,
    data, 
    nonce,
    to: contractAddress,
    from: process.env.PUBLIC_KEY,
  };

  try {
    const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(receipt);
  } catch (err) {
    console.log("Failed " + err);
  }
}

mintNFT("ipfs://QmUrFcVBEngWCimE1kjfL2AtK7m8xGqnnv71jpiVWcLVfg");