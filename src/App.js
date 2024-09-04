import React, { useState } from 'react';
import './App.css';
import Web3 from 'web3';
import contractABI from './DecentralizeAutoFund.json';

function App() {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [hostId, setHostId] = useState('');
  const [voteAmount, setVoteAmount] = useState('');
  const [newSignUpProportion, setNewSignUpProportion] = useState('');
  
  const web3 = new Web3(window.ethereum);
  const contractAddress = '0x4CdC36708279508A7E2c45a424A20159776f3167'; // Địa chỉ hợp đồng từ file JSON
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

  const handleHostFund = async () => {
    try {
      await contract.methods.hostFund(web3.utils.toWei(amount, 'ether'), 86400).send({ from: account });
      alert('Fund hosted successfully!');
    } catch (error) {
      console.error('Error hosting fund:', error);
      alert('Failed to host fund.');
    }
  };

  const handleVote = async () => {
    try {
      await contract.methods.voteFund(parseInt(hostId)).send({ from: account, value: web3.utils.toWei(voteAmount, 'ether') });
      alert('Voted successfully!');
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote.');
    }
  };

  const handleInvestment = async () => {
    try {
      await contract.methods.makeInvestment(parseInt(hostId)).send({ from: account });
      alert('Investment made successfully!');
    } catch (error) {
      console.error('Error making investment:', error);
      alert('Failed to make investment.');
    }
  };

  const handleWithdraw = async () => {
    try {
      await contract.methods.withdrawFund().send({ from: account });
      alert('Funds withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      alert('Failed to withdraw funds.');
    }
  };

  const handleChangeProportion = async () => {
    try {
      await contract.methods.changeProportionMemberSignUp(parseInt(newSignUpProportion)).send({ from: account });
      alert('Proportion changed successfully!');
    } catch (error) {
      console.error('Error changing proportion:', error);
      alert('Failed to change proportion.');
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
        <h1>Cryptocurrency Transfer</h1>
        <button onClick={handleConnect}>Connect MetaMask</button>
        <div className="App-content">
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
            <h2>Host Fund</h2>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Fund Amount (ETH)"
            />
            <button onClick={handleHostFund}>Host Fund</button>
          </div>
          <div className="App-section">
            <h2>Vote for Fund</h2>
            <input
              type="text"
              value={hostId}
              onChange={(e) => setHostId(e.target.value)}
              placeholder="Host ID"
            />
            <input
              type="text"
              value={voteAmount}
              onChange={(e) => setVoteAmount(e.target.value)}
              placeholder="Vote Amount (ETH)"
            />
            <button onClick={handleVote}>Vote</button>
          </div>
          <div className="App-section">
            <h2>Make Investment</h2>
            <input
              type="text"
              value={hostId}
              onChange={(e) => setHostId(e.target.value)}
              placeholder="Host ID"
            />
            <button onClick={handleInvestment}>Make Investment</button>
          </div>
          <div className="App-section">
            <h2>Withdraw Funds</h2>
            <button onClick={handleWithdraw}>Withdraw</button>
          </div>
          <div className="App-section">
            <h2>Change Sign-Up Proportion</h2>
            <input
              type="text"
              value={newSignUpProportion}
              onChange={(e) => setNewSignUpProportion(e.target.value)}
              placeholder="New Proportion"
            />
            <button onClick={handleChangeProportion}>Change Proportion</button>
          </div>
          <div className="App-section">
            <h2>Check Balance</h2>
            <button onClick={checkBalance}>Check Balance</button>
            <p>Balance: {balance} ETH</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
