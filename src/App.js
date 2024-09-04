import React, { useState } from 'react';
import './App.css';
import Web3 from 'web3';
import contractABI from './DecentralizeAutoFund.json';
import HamburgerMenu from './HamburgerMenu';

function App() {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const web3 = new Web3(window.ethereum);
  const contractAddress = '0x4CdC36708279508A7E2c45a424A20159776f3167';
  const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

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
    try {
      await contract.methods.signUp(parseInt(age), name).send({ from: account, value: web3.utils.toWei(amount, 'ether') });
      alert('Signed up successfully!');
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Failed to sign up.');
    }
  };

  const checkBalance = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Decentralize Auto Fund</h1>
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
