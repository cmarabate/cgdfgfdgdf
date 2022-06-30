import React from "react";
import Onboard from "bnc-onboard";
import "./styles.css";
import Web3 from "web3";

const FORTMATIC_KEY = "pk_test_30277159083054BE";
const RPC_URL = "https://rinkeby.infura.io/v3/ea4e9dbe0feb463da320e8bd8056f82f";
const INFURA_KEY = "ea4e9dbe0feb463da320e8bd8056f82f";

const wallets = [
  { walletName: "coinbase", preferred: true },
  { walletName: "trust", preferred: true, rpcUrl: RPC_URL },
  { walletName: "metamask", preferred: true },
  { walletName: "authereum" },
  {
    walletName: "ledger",
    rpcUrl: RPC_URL
  },
  {
    walletName: "fortmatic",
    apiKey: FORTMATIC_KEY,
    preferred: true
  },
  {
    walletName: "walletConnect",
    infuraKey: INFURA_KEY
  },
  { walletName: "opera" },
  { walletName: "operaTouch" },
  { walletName: "torus" },
  { walletName: "status" },
  { walletName: "imToken", rpcUrl: RPC_URL }
];

let web3;
var factoryAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tierIndex",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "claim",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
];

var myContract;

const onboard = Onboard({
  dappId: "877e8915-22d9-450e-a9b8-799bfd51798e", // [String] The API key created by step one above
  networkId: 4, // [Integer] The Ethereum network ID your Dapp uses.
  walletSelect: {
    wallets: wallets
  },
  subscriptions: {
    wallet: (wallet) => {
      web3 = new Web3(wallet.provider);
      console.log(`${wallet.name} is now connected`);
      console.log(`${wallet.address}`);
      myContract = new web3.eth.Contract(
        factoryAbi,
        "0xe124c2feA0a70Eaa0F447FFB375B735662D8470f"
      );
    }
  }
});

async function login() {
  await onboard.walletSelect();
  await onboard.walletCheck();
}

async function buyNFT() {
  const currentState = onboard.getState();
  console.log(currentState.address);
  myContract.methods
    .claim(0, "0x11260D7c8106Ee445a7e21b154F1c4F44833EcE9", 1)
    .send({ from: currentState.address, value: 10000000000000000 });
}

export default function App() {
  return (
    <div className="App">
      <button className="nav-link w-nav-link" onClick={login}>
        ⚡️ Connect wallet
      </button>
    </div>
  );
}
