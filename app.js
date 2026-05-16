import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.4/+esm";

// Replace these with your deployed Sepolia contract addresses
const WALLET_VERIFICATION_ADDRESS = "0xYourVerificationContract";
const FAUCET_ADDRESS = "0xYourFaucetContract";
const NFT_ADDRESS = "0xYourNFTContract";

// Replace these with the relevant ABI entries from Remix
const walletVerificationAbi = [
  "function register(bytes32 tokenHash) external"
];

const faucetAbi = [
  "function claim() external"
];

const nftAbi = [
  "function mint() external",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

let provider;
let signer;
let userAddress;

const status = document.getElementById("status");

function setStatus(msg) {
  status.textContent = msg;
}

async function connectWallet() {
  if (!window.ethereum) {
    setStatus("MetaMask is not installed.");
    return;
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  userAddress = await signer.getAddress();

  document.getElementById("wallet").textContent = userAddress;
  setStatus("Wallet connected.");
}

async function verifyWallet() {
  const token = document.getElementById("token").value.trim();

  if (!token) {
    setStatus("Enter your course token first.");
    return;
  }

  const tokenHash = ethers.keccak256(ethers.toUtf8Bytes(token));

  const contract = new ethers.Contract(
    WALLET_VERIFICATION_ADDRESS,
    walletVerificationAbi,
    signer
  );

  const tx = await contract.register(tokenHash);
  setStatus("Verification transaction submitted.");
  await tx.wait();
  setStatus("Wallet verified.");
}

async function claimFaucet() {
  const contract = new ethers.Contract(
    FAUCET_ADDRESS,
    faucetAbi,
    signer
  );

  const tx = await contract.claim();
  setStatus("Faucet transaction submitted.");
  await tx.wait();
  setStatus("Sepolia ETH claimed.");
}

async function mintNFT() {
  const contract = new ethers.Contract(
    NFT_ADDRESS,
    nftAbi,
    signer
  );

  const tx = await contract.mint();
  setStatus("NFT mint transaction submitted.");
  await tx.wait();
  setStatus("NFT minted.");
}

async function viewNFT() {
  const tokenId = document.getElementById("tokenId").value.trim();

  const contract = new ethers.Contract(
    NFT_ADDRESS,
    nftAbi,
    provider
  );

  const uri = await contract.tokenURI(tokenId);
  document.getElementById("nftUri").textContent = uri;
}

document.getElementById("connect").onclick = connectWallet;
document.getElementById("verify").onclick = verifyWallet;
document.getElementById("claim").onclick = claimFaucet;
document.getElementById("mint").onclick = mintNFT;
document.getElementById("viewNFT").onclick = viewNFT;
