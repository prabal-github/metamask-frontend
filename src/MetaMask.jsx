import { ethers } from "ethers";
import { useState, useEffect } from "react";
import "./MetaMask.css"; // Import CSS file

const MetaMask = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);
  const [provider, setProvider] = useState(null); // Provider state

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  const handleConnect = () => {
    if (!provider) {
      setErrorMsg("MetaMask not found!");
      return;
    }
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result) => {
        accountChanged(result[0]);
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  const accountChanged = async (accountName) => {
    setDefaultAccount(accountName);
    getAccountBalance(accountName);
  };

  const getAccountBalance = async (accountAddress) => {
    if (!provider) return;
    try {
      const balance = await provider.getBalance(accountAddress);
      setAccountBalance(ethers.formatEther(balance));
    } catch (error) {
      setErrorMsg("Error fetching account balance.");
      console.error(error);
    }
  };

  const handleMint = async () => {
    try {
      if (!provider) {
        setErrorMsg("MetaMask not found!");
        return;
      }
      const response = await fetch(
        `http://localhost:3000/wallet?address=${defaultAccount}`
      );
      const data = await response.json();
      console.log(data);
      if (!data) {
        mintNFT(false);
      } else {
        mintNFT(true);
      }
    } catch (error) {
      setErrorMsg("Error checking wallet.");
      console.error(error);
    }
  };

  const mintNFT = async (isPrivateMint) => {
    try {
      if (!provider) {
        setErrorMsg("MetaMask not found!");
        return;
      }
      const contractAddress = "0xfb132D7FECFdC01771C6897f04B81f75a28737fB";
      const contractABI = [
        {
          inputs: [
            { internalType: "address", name: "initialOwner", type: "address" },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            { internalType: "address", name: "sender", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
            { internalType: "address", name: "owner", type: "address" },
          ],
          name: "ERC721IncorrectOwner",
          type: "error",
        },
        {
          inputs: [
            { internalType: "address", name: "operator", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          name: "ERC721InsufficientApproval",
          type: "error",
        },
        {
          inputs: [
            { internalType: "address", name: "approver", type: "address" },
          ],
          name: "ERC721InvalidApprover",
          type: "error",
        },
        {
          inputs: [
            { internalType: "address", name: "operator", type: "address" },
          ],
          name: "ERC721InvalidOperator",
          type: "error",
        },
        {
          inputs: [{ internalType: "address", name: "owner", type: "address" }],
          name: "ERC721InvalidOwner",
          type: "error",
        },
        {
          inputs: [
            { internalType: "address", name: "receiver", type: "address" },
          ],
          name: "ERC721InvalidReceiver",
          type: "error",
        },
        {
          inputs: [
            { internalType: "address", name: "sender", type: "address" },
          ],
          name: "ERC721InvalidSender",
          type: "error",
        },
        {
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          name: "ERC721NonexistentToken",
          type: "error",
        },
        {
          inputs: [{ internalType: "address", name: "owner", type: "address" }],
          name: "OwnableInvalidOwner",
          type: "error",
        },
        {
          inputs: [
            { internalType: "address", name: "account", type: "address" },
          ],
          name: "OwnableUnauthorizedAccount",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "approved",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "ApprovalForAll",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          name: "approve",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [{ internalType: "address", name: "owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          name: "getApproved",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "operator", type: "address" },
          ],
          name: "isApprovedForAll",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "quantity", type: "uint256" },
          ],
          name: "mint",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          name: "ownerOf",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "quantity", type: "uint256" },
          ],
          name: "privateMint",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
            { internalType: "bytes", name: "data", type: "bytes" },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "operator", type: "address" },
            { internalType: "bool", name: "approved", type: "bool" },
          ],
          name: "setApprovalForAll",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
          ],
          name: "supportsInterface",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          name: "tokenURI",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          name: "transferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "newOwner", type: "address" },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      let mintFunction;
      let price;
      if (isPrivateMint) {
        mintFunction = contract.privateMint;
        price = ethers.parseEther("0.001");
      } else {
        mintFunction = contract.mint;
        price = ethers.parseEther("0.002");
      }

      const overrides = {
        value: price,
        gasLimit: 300000,
        // gasPrice: ethers.parseUnits("50", "gwei"),
      };
      const transaction = await mintFunction(1, overrides);
      await transaction.wait();

      console.log("NFT Minted successfully!");
    } catch (error) {
      setErrorMsg("Error minting NFT.");
      console.error(error);
    }
  };

  return (
    <div className="metamask-container">
      <h2>MetaMask Connection</h2>
      <div className="account-info">
        {!accountBalance && (
          <button className="connect-btn" onClick={handleConnect}>
            Connect Wallet
          </button>
        )}
        {accountBalance && (
          <div className="account-details">
            <p>
              <strong>Address:</strong> {defaultAccount}
            </p>
            <p>
              <strong>Balance:</strong>{" "}
              {accountBalance ? "$" + accountBalance : null}
            </p>
          </div>
        )}
      </div>
      <div className="mint-section">
        {accountBalance && (
          <button className="mint-btn" onClick={handleMint}>
            Mint NFT
          </button>
        )}
      </div>
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
    </div>
  );
};

export default MetaMask;
