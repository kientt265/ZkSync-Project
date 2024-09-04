import React, { useState } from 'react';
import './App.css';
import Web3 from 'web3';
import { zkSyncProvider } from 'zksync';

function App() {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');

  const handleConnect = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleSend = async () => {
    // Implement sending funds logic
  };

  const handleWithdraw = async () => {
    // Implement withdrawing funds logic
  };

  const checkBalance = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
  
    try {
      const web3 = new Web3(window.ethereum);
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
        <h1>Cryptocurrency Transfer</h1>
        <button onClick={handleConnect}>
          Connect MetaMask
        </button>
        <div className="App-content">
          <div className="App-section">
            <h2>Send Funds</h2>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <button onClick={handleSend}>Send</button>
          </div>
          <div className="App-section">
            <h2>Withdraw Funds</h2>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <button onClick={handleWithdraw}>Withdraw</button>
          </div>
          <div className="App-section">
            <h2>Check Balance</h2>
            <button onClick={checkBalance}>Check Balance</button>
            <p>Balance: {balance}</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
