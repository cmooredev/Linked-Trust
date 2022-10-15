export const LINKED_TRUST_CONTRACT_ADDRESS = "0x25d1567B903FC5b91127316e070c08125e2693f2";
export const abi = [
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "trustID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "beneficiary",
          "type": "address"
        }
      ],
      "name": "NewBeneficiary",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "trustID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "vote",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "authorizedUser",
          "type": "address"
        }
      ],
      "name": "NewProposalVote",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "trustID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "beneficiary",
          "type": "address"
        }
      ],
      "name": "NewProposedBeneficiary",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "trustID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "when",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "name": "NewTrust",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "trustID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "funder",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TrustFunded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "when",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "who",
          "type": "address"
        }
      ],
      "name": "Withdrawal",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_unlockTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_unlockPrice",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_authorizedOne",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_authorizedTwo",
          "type": "address"
        }
      ],
      "name": "createNewTrust",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_trustID",
          "type": "uint256"
        }
      ],
      "name": "fundTrust",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_trustID",
          "type": "uint256"
        }
      ],
      "name": "getTrustAuthorizedUsers",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_trustID",
          "type": "uint256"
        }
      ],
      "name": "getTrustBeneficiaries",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_trustID",
          "type": "uint256"
        }
      ],
      "name": "getTrustCreator",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_trustID",
          "type": "uint256"
        }
      ],
      "name": "getTrustUnlockPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_trustID",
          "type": "uint256"
        }
      ],
      "name": "getTrustUnlockTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_beneficiary",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_trustID",
          "type": "uint256"
        }
      ],
      "name": "proposeBeneficiary",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_trustID",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "vote",
          "type": "bool"
        }
      ],
      "name": "setAuthorizedUserApprovalOrDenial",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_beneficiary",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_trustID",
          "type": "uint256"
        }
      ],
      "name": "setBeneficiary",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalNumberOfTrusts",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "trusts",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "currentValue",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "unlockTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "unlockPrice",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "authorizedOne",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "authorizedTwo",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "proposedBeneficiary",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_trustID",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];
