const DecentralizeAutoFund = artifacts.require("DecentralizeAutoFund");

contract("DecentralizeAutoFund", (accounts) => {
    let contractInstance;
    const minMoneySignUp = web3.utils.toWei("1", "ether");

    before(async () => {
        contractInstance = await DecentralizeAutoFund.new(minMoneySignUp);
    });

    it("should allow a member to sign up", async () => {
        const age = 30;
        const name = "Alice";
        const signUpValue = web3.utils.toWei("1", "ether");

        await contractInstance.signUp(age, name, { from: accounts[0], value: signUpValue });

        const member = await contractInstance.members(accounts[0]);
        assert.equal(member.age, age, "Age does not match");
        assert.equal(member.name, name, "Name does not match");
        assert.equal(member.isActive, true, "Member should be active");
    });

    it("should not allow a member to sign up with insufficient funds", async () => {
        const age = 25;
        const name = "Bob";
        const signUpValue = web3.utils.toWei("0.5", "ether");

        try {
            await contractInstance.signUp(age, name, { from: accounts[1], value: signUpValue });
            assert.fail("Expected revert not received");
        } catch (error) {
            assert(error.reason === "Insufficient funds for sign up!", "Unexpected revert reason");
        }
    });

    it("should allow an active member to host a fund", async () => {
        const fundAmount = web3.utils.toWei("2", "ether");
        const duration = 86400; // 1 day in seconds

        await contractInstance.hostFund(fundAmount, duration, { from: accounts[0] });

        const fund = await contractInstance.hostFunds(0);
        assert.equal(fund.host, accounts[0], "Host does not match");
        assert.equal(fund.amount, fundAmount, "Fund amount does not match");
        assert(fund.endTime > 0, "End time should be set");
    });

    it("should allow an active member to vote on a fund", async () => {
        const voteAmount = web3.utils.toWei("0.5", "ether");

        await contractInstance.voteFund(0, { from: accounts[0], value: voteAmount });

        const fund = await contractInstance.hostFunds(0);
        assert.equal(fund.totalVotes, voteAmount, "Total votes do not match");
    });

    it("should not allow voting after the fund period has ended", async () => {
        // Fast forward time to simulate end of fund duration
        await new Promise((resolve, reject) => {
            web3.currentProvider.send(
                {
                    jsonrpc: "2.0",
                    method: "evm_increaseTime",
                    params: [86400 + 1], // 1 day + 1 second
                    id: new Date().getTime(),
                },
                (err) => {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });

        const voteAmount = web3.utils.toWei("0.1", "ether");

        try {
            await contractInstance.voteFund(0, { from: accounts[1], value: voteAmount });
            assert.fail("Expected revert not received");
        } catch (error) {
            // Thay đổi này để kiểm tra nội dung lỗi chính xác
            assert(error.message.includes("Voting period has ended"), "Unexpected revert reason");
        }
    });

    it("should allow investment to be made after voting period", async () => {
        // Thêm votes trước khi đầu tư
        const additionalVoteAmount = web3.utils.toWei("2", "ether");
        await contractInstance.voteFund(0, { from: accounts[1], value: additionalVoteAmount });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await contractInstance.makeInvestment(0, { from: accounts[0] });

        const fund = await contractInstance.hostFunds(0);
        assert.equal(fund.isCompleted, true, "Investment should be completed");

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        assert(finalBalance > initialBalance, "Host balance should increase after investment");
    });

    it("should allow an active member to withdraw funds", async () => {
        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await contractInstance.withdrawFund({ from: accounts[0] });

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        assert(finalBalance > initialBalance, "Balance should increase after withdrawal");

        const member = await contractInstance.members(accounts[0]);
        assert.equal(member.isActive, false, "Member should no longer be active");
    });

    it("should allow the contract owner to change the sign-up proportion", async () => {
        const newMinMoneySignUp = web3.utils.toWei("1.5", "ether");
        await contractInstance.changeProportionMemberSignUp(newMinMoneySignUp, { from: accounts[0] });

        const updatedMinMoneySignUp = await contractInstance.minMoneySignUp();
        assert.equal(updatedMinMoneySignUp.toString(), newMinMoneySignUp, "Sign-up proportion should be updated");
    });

    it("should return the correct contract balance", async () => {
        // Thêm tiền vào contract trước khi kiểm tra balance
        await contractInstance.signUp(25, "TestUser", { from: accounts[1], value: web3.utils.toWei("1", "ether") });

        const contractBalance = await contractInstance.getContractBalance();
        assert(contractBalance > 0, "Contract balance should be greater than zero");
    });

    it("should correctly check if a member is active", async () => {
        const isActive = await contractInstance.isMemberActive(accounts[0]);
        assert.equal(isActive, false, "Member should not be active after withdrawal");
    });
});
