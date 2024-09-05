import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import contractABI from './DecentralizeAutoFund.json';
import HamburgerMenu from './HamburgerMenu';

console.log('Contract ABI:', contractABI.abi); // Add this line to check the ABI

function App() {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const address = process.env.REACT_APP_CONTRACT_ADDRESS;
    console.log('Contract address from .env:', address);
    if (!address) {
      console.error('Contract address not found in .env file');
    } else {
      console.log('Contract address:', address);
      setContractAddress(address);
    }

    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      console.log('Web3 initialized:', web3Instance);
    } else {
      console.error('Ethereum object not found. Please install MetaMask.');
    }
  }, []);

  useEffect(() => {
    if (contractAddress && web3) {
      console.log('Initializing contract with address:', contractAddress);
      try {
        const newContract = new web3.eth.Contract(contractABI.abi, contractAddress);
        setContract(newContract);
        console.log('Contract initialized successfully:', newContract);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    } else {
      console.log('Cannot initialize contract. contractAddress:', contractAddress, 'web3:', web3);
    }
  }, [contractAddress, web3]);

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleSignUp = async () => {
    if (!account) {
      alert('Please connect your MetaMask wallet first.');
      return;
    }

    if (!contract) {
      console.error('Contract is null. contractAddress:', contractAddress, 'web3:', web3);
      alert('Contract not initialized. Please check your connection and try again.');
      return;
    }

    try {
      const ageInt = parseInt(age, 10);
      if (isNaN(ageInt) || ageInt < 18) {
        throw new Error('Age must be a valid number and at least 18');
      }

      if (!name.trim()) {
        throw new Error('Name cannot be empty');
      }

      const amountWei = web3.utils.toWei(amount, 'ether');
      if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        throw new Error('Amount must be a positive number');
      }

      console.log(`Signing up with age: ${ageInt}, name: ${name}, amount: ${amountWei} Wei`);

      const result = await contract.methods.signUp(ageInt, name)
        .send({ from: account, value: amountWei });

      console.log('Sign up result:', result);
      alert('Signed up successfully!');
    } catch (error) {
      console.error('Error signing up:', error);
      alert(`Failed to sign up: ${error.message}`);
    }
  };

  const checkBalance = async () => {
    if (!web3 || !account) {
      alert('Please connect your MetaMask wallet first.');
      return;
    }
  
    try {
      const balanceWei = await web3.eth.getBalance(account);
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      setBalance(balanceEth);
    } catch (error) {
      console.error('Error fetching balance:', error);
      alert('Failed to fetch balance.');
    }
  };

  const fetchMembers = async () => {
    if (!contract) {
      console.error('Contract is null when fetching members');
      alert('Contract not initialized. Please check your .env file and network connection.');
      return;
    }

    try {
      console.log('Fetching members...');
      const membersData = await contract.methods.getMembers().call();
      console.log('Member data:', membersData);

      if (Array.isArray(membersData) && membersData.length === 3) {
        const [memberAddresses, ages, names] = membersData;
        const formattedMembers = memberAddresses.map((address, index) => ({
          name: names[index],
          age: ages[index],
          addr: address
        }));

        setMembers(formattedMembers);
        setShowMembers(true);
      } else {
        console.error('Unexpected format of member data:', membersData);
        alert('Failed to fetch members: Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      alert(`Failed to fetch members: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Decentralize Auto Fund</h1>
        {contractAddress && (
          <p className="contract-address">
            Contract Address: {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
          </p>
        )}
        <button onClick={handleConnect}>Connect MetaMask</button>
        {account && (
          <>
            <div className="App-section">
              <h2>Sign Up</h2>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Sign-Up Amount (ETH)"
              />
              <button onClick={handleSignUp}>Sign Up</button>
            </div>
            <div className="App-section">
              <h2>Check Balance</h2>
              <button onClick={checkBalance}>Check Balance</button>
              <p>Balance: {balance} ETH</p>
            </div>
            <div className="App-section">
              <h2>Member List</h2>
              <button onClick={fetchMembers}>Show Members</button>
              {showMembers && (
                <ul className="member-list">
                  {members.map((member, index) => (
                    <li key={index}>
                      Name: {member.name}, Age: {member.age}, Address: {member.addr}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
            {isMenuOpen && (
              <HamburgerMenu
                account={account}
                contract={contract}
                web3={web3}
              />
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;
