import React, { useState } from 'react';

function HamburgerMenu({ account, contract, web3 }) {
  const [hostId, setHostId] = useState('');
  const [voteAmount, setVoteAmount] = useState('');
  const [newSignUpProportion, setNewSignUpProportion] = useState('');
  const [amount, setAmount] = useState('');

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

  return (
    <div className="menu-content">
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
    </div>
  );
}

export default HamburgerMenu;
