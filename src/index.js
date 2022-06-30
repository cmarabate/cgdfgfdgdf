import { StrictMode } from "react";
import ReactDOM from "react-dom";

//import App from "./App";

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
const factoryAddress = "0x9D8cFe041Cf8F3791802B5c88C2E1908df7118a3";
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
  },
  {
    inputs: [],
    name: "endBlockTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "startBlockTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

var myContract;
var saleState;
var timeRemaining;
var startBlockTimestamp;
var endBlockTimestamp;

const onboard = Onboard({
  dappId: "877e8915-22d9-450e-a9b8-799bfd51798e", // [String] The API key created by step one above
  networkId: 4, // [Integer] The Ethereum network ID your Dapp uses.
  walletSelect: {
    wallets: wallets
  },
  subscriptions: {
    wallet: (wallet) => {
      window.localStorage.setItem("selectedWallet", wallet.name);
      web3 = new Web3(wallet.provider);
      console.log(`${wallet.name} is now connected`);
      myContract = new web3.eth.Contract(factoryAbi, factoryAddress);
    }
  }
});

async function login() {
  const walletSelected = await onboard.walletSelect();
  if (walletSelected !== false) {
    const walletCheck = await onboard.walletCheck();
    console.log(walletCheck);
    if (walletCheck === true) {
      await getSaleTime("buyButton");
      const currentState = onboard.getState();
      console.log(currentState["address"]);
      const completeAddress = currentState["address"];
      const currentAddress =
        completeAddress.substring(0, 4) +
        "..." +
        completeAddress.substring(
          completeAddress.length - 4,
          completeAddress.length
        );
      ReactDOM.render(
        <button
          id="connectWallet"
          className="nav-link w-nav-link"
          onClick={login}
        >
          Wallet: {currentAddress}
        </button>,
        document.getElementById("connectWalletDiv")
      );
    }
  }
}

async function getSaleTime(setObject) {
  var simpleWeb3 = new Web3(
    "https://rinkeby.infura.io/v3/ea4e9dbe0feb463da320e8bd8056f82f"
  );
  var thisFactoryContract = new simpleWeb3.eth.Contract(
    factoryAbi,
    factoryAddress
  );
  // get call for start time and end time
  await thisFactoryContract.methods
    .startBlockTimestamp()
    .call({ from: "0x11260D7c8106Ee445a7e21b154F1c4F44833EcE9" }, function (
      error,
      result
    ) {
      startBlockTimestamp = Number(result) * 1000;
    });

  await thisFactoryContract.methods
    .endBlockTimestamp()
    .call({ from: "0x11260D7c8106Ee445a7e21b154F1c4F44833EcE9" }, function (
      error,
      result
    ) {
      endBlockTimestamp = Number(result) * 1000;
      console.log(endBlockTimestamp);
    });
  if (setObject === "clock") {
    setClock(startBlockTimestamp, endBlockTimestamp);
  } else if (setObject === "buyButton") {
    setBuyButton(startBlockTimestamp, endBlockTimestamp);
  }
}

async function buyNFT() {
  console.log("buyNFT");
  const currentState = onboard.getState();
  console.log(currentState.address);
  myContract.methods
    .claim(0, currentState.address, 1)
    .send({ from: currentState.address, value: 10000000000000000 })
    .on("transactionHash", function (hash) {
      console.log(hash);
      // show transaction link to etherscan
    })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
    })
    .on("receipt", function (receipt) {
      console.log(receipt);
      // perform success modal
    })
    .on("error", function (error, receipt) {
      // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
      console.log(error);
      // show error text
    });
}

//clock
const clockHeader = document.getElementById("clockHeader");
const numberHours = document.getElementById("numberHours");
const numberMinutes = document.getElementById("numberMinutes");
const numberSeconds = document.getElementById("numberSeconds");

function timerCountdown(toTimeStamp) {
  var countDownDate = toTimeStamp;

  // Update the count down every 1 second
  var x = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();
    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    hours = hours + days * 24;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    numberHours.innerHTML = hours;
    numberMinutes.innerHTML = minutes;
    numberSeconds.innerHTML = seconds;

    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(x);
      clockHeader.innerHTML = "Sale Complete";
    }
  }, 1000);
}

function setClock(startTime, endTime) {
  const seriesTitleAboveClock = document.getElementById(
    "seriesTitleAboveClock"
  );
  // get current time
  const secondsSinceEpoch = Math.round(Date.now());
  if (secondsSinceEpoch < startTime) {
    saleState = "pre";
    /// clock is countdown until sale StartTime
    seriesTitleAboveClock.innerHTML =
      seriesTitleAboveClock.innerHTML + " | Begins In:";
    timerCountdown(startTime);
  } else if (secondsSinceEpoch > startTime && secondsSinceEpoch < endTime) {
    saleState = "active";
    // clock is countdown until sale EndTime
    seriesTitleAboveClock.innerHTML =
      seriesTitleAboveClock.innerHTML + " | Ends In:";
    timerCountdown(endTime);
  } else if (secondsSinceEpoch > endTime) {
    saleState = "post";
    // clock is removed with "Sale Complete" text
    timerCountdown(endTime);
  }
}

function setBuyButton(startTime, endTime) {
  const buyNFTButton = document.getElementById("buyNFTButton");
  // get current time
  const secondsSinceEpoch = Math.round(Date.now());
  if (secondsSinceEpoch < startTime) {
    // button dissabled
    buyNFTButton.disabled = true;
    buyNFTButton.style.backgroundColor = "gray";
  } else if (secondsSinceEpoch > startTime && secondsSinceEpoch < endTime) {
    // button enabled
    buyNFTButton.style.backgroundColor = "#007bff";
    buyNFTButton.onclick = buyNFT;
  } else if (secondsSinceEpoch > endTime) {
    // button dissabled
    buyNFTButton.disabled = true;
    buyNFTButton.style.backgroundColor = "gray";
  }
}

getSaleTime("clock");

ReactDOM.render(
  <div className="App" id="connectWalletDiv">
    <button id="connectWallet" className="nav-link w-nav-link" onClick={login}>
      ⚡️ Connect wallet
    </button>
  </div>,
  document.getElementById("root")
);

ReactDOM.render(
  <div className="button-container" style={{ zIndex: "unset" }}>
    <button
      id="buyNFTButton"
      className="button button-size-large w-button"
      style={{ zIndex: "unset", backgroundColor: "gray" }}
    >
      Purchase for 1 ETH
    </button>
  </div>,
  document.getElementById("purchaseBtn")
);
