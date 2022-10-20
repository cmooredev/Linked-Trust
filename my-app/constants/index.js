export const LINKED_TRUST_CONTRACT_ADDRESS = "0x2E48762c97bEC1374034F61Fc972563DB66a003A";
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
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "trustValue",
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
      "name": "getTrust",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
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
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];
