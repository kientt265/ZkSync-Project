import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import FundCoreL1ABI from './FundCoreL1.json';
import FundBridgeL1ABI from './FundBridgeL1.json';
import FundCoreL2ABI from './FundCoreL2.json';
import FundBridgeL2ABI from './FundBridgeL2.json';

function App() {
  const [web3L1, setWeb3L1] = useState(null);
  const [web3L2, setWeb3L2] = useState(null);
  const [account, setAccount] = useState('');
  const [fundCoreL1, setFundCoreL1] = useState(null);
  const [fundBridgeL1, setFundBridgeL1] = useState(null);
  const [fundCoreL2, setFundCoreL2] = useState(null);
  const [fundBridgeL2, setFundBridgeL2] = useState(null);
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [signUpAmount, setSignUpAmount] = useState('');
  const [fundName, setFundName] = useState('');
  const [fundReason, setFundReason] = useState('');
  const [fundGoal, setFundGoal] = useState('');
  const [fundDuration, setFundDuration] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [fundRaiserId, setFundRaiserId] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3L1(web3Instance);
        setWeb3L2(new Web3('https://zksync2-testnet.zksync.dev')); // zkSync testnet URL
        try {
          await window.ethereum.enable();
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          initContracts(web3Instance);
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    initWeb3();
  }, []);

  const initContracts = (web3) => {
    const fundCoreL1Instance = new web3.eth.Contract(FundCoreL1ABI.abi, FundCoreL1ABI.networks[1].address);
    const fundBridgeL1Instance = new web3.eth.Contract(FundBridgeL1ABI.abi, FundBridgeL1ABI.networks[1].address);
    const fundCoreL2Instance = new web3L2.eth.Contract(FundCoreL2ABI.abi, FundCoreL2ABI.networks[280].address);
    const fundBridgeL2Instance = new web3L2.eth.Contract(FundBridgeL2ABI.abi, FundBridgeL2ABI.networks[280].address);

    setFundCoreL1(fundCoreL1Instance);
    setFundBridgeL1(fundBridgeL1Instance);
    setFundCoreL2(fundCoreL2Instance);
    setFundBridgeL2(fundBridgeL2Instance);
  };

  const handleSignUp = async () => {
    try {
      await fundCoreL1.methods.signUp(age, name).send({
        from: account,
        value: web3L1.utils.toWei(signUpAmount, 'ether')
      });
      alert('Signed up successfully!');
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Failed to sign up');
    }
  };

  const handleHostFund = async () => {
    try {
      await fundCoreL1.methods.hostFund(fundName, fundReason, web3L1.utils.toWei(fundGoal, 'ether'), fundDuration).send({ from: account });
      alert('Fund hosted successfully!');
    } catch (error) {
      console.error('Error hosting fund:', error);
      alert('Failed to host fund');
    }
  };

  const handleContribute = async () => {
    try {
      await fundCoreL2.methods.contribute(fundRaiserId).send({
        from: account,
        value: web3L2.utils.toWei(contributionAmount, 'ether')
      });
      alert('Contribution successful!');
    } catch (error) {
      console.error('Error contributing:', error);
      alert('Failed to contribute');
    }
  };

  const syncFundRaiserStatus = async () => {
    try {
      await fundBridgeL1.methods.syncFundRaiserStatus(fundRaiserId, true).send({ from: account });
      alert('Fund raiser status synced successfully!');
    } catch (error) {
      console.error('Error syncing fund raiser status:', error);
      alert('Failed to sync fund raiser status');
    }
  };

  return (
    <div className="App">
      <h1>Decentralized Auto Fund</h1>
      <p>Connected Account: {account}</p>

      <div className="App-section">
        <h2>Sign Up (L1)</h2>
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Sign Up Amount (ETH)" value={signUpAmount} onChange={(e) => setSignUpAmount(e.target.value)} />
        <button onClick={handleSignUp}>Sign Up</button>
      </div>

      <div className="App-section">
        <h2>Host Fund (L1)</h2>
        <input type="text" placeholder="Fund Name" value={fundName} onChange={(e) => setFundName(e.target.value)} />
        <input type="text" placeholder="Reason" value={fundReason} onChange={(e) => setFundReason(e.target.value)} />
        <input type="text" placeholder="Goal Amount (ETH)" value={fundGoal} onChange={(e) => setFundGoal(e.target.value)} />
        <input type="number" placeholder="Duration (minutes)" value={fundDuration} onChange={(e) => setFundDuration(e.target.value)} />
        <button onClick={handleHostFund}>Host Fund</button>
      </div>

      <div className="App-section">
        <h2>Contribute (L2)</h2>
        <input type="number" placeholder="Fund Raiser ID" value={fundRaiserId} onChange={(e) => setFundRaiserId(e.target.value)} />
        <input type="text" placeholder="Contribution Amount (ETH)" value={contributionAmount} onChange={(e) => setContributionAmount(e.target.value)} />
        <button onClick={handleContribute}>Contribute</button>
      </div>

      <div className="App-section">
        <h2>Sync Fund Raiser Status (L1 to L2)</h2>
        <input type="number" placeholder="Fund Raiser ID" value={fundRaiserId} onChange={(e) => setFundRaiserId(e.target.value)} />
        <button onClick={syncFundRaiserStatus}>Sync Status</button>
      </div>
    </div>
  );
}

export default App;
