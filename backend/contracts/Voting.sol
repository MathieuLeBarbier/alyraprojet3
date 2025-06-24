// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

error NotVoter();
error AlreadyVoter();
error ProposalNotFound();
error CannotProposeNothing();
error AlreadyVoted();
error InvalidWorkflowStatus(uint256 requiredStatus, uint256 currentStatus);

/// @title Voting Smart Contract
/// @author Alyra - Promo Berners-Lee
contract Voting is Ownable {
    uint public winningProposalID;
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;

    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    constructor() Ownable(msg.sender) {    }
    
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, NotVoter());
        _;
    }
    
    /// @notice Get the voter informations
    /// @param _addr The address of the voter
    /// @return Voter informations (See the Voter struct)
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }
    
    /// @notice Get the proposal informations
    /// @param _id The id of the proposal
    /// @return Proposal informations (See the Proposal struct)
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

    /// @notice Add a voter
    /// @param _addr The address of the voter
    /// @dev Only the owner can add a voter
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, InvalidWorkflowStatus(WorkflowStatus.RegisteringVoters, uint256(workflowStatus)));
        require(voters[_addr].isRegistered != true, AlreadyVoter());
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    /// @notice Add a proposal
    /// @param _desc The description of the proposal
    /// @dev Only voters are allowed to add a proposal
    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, InvalidWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted, uint256(workflowStatus)));
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), CannotProposeNothing());

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1);
    }

    /// @notice Set a vote
    /// @param _id The id of the proposal
    /// @dev Only voters are allowed to vote
    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, InvalidWorkflowStatus(WorkflowStatus.VotingSessionStarted, uint256(workflowStatus)));
        require(voters[msg.sender].hasVoted != true, AlreadyVoted());
        require(_id < proposalsArray.length, ProposalNotFound());

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        // TODO: Issue 1 - Change the way to track winner. After each vote, we can check if the voted proposal is the winner
        // by comparing the vote count of the voted proposal and the winning proposal. Automatically update the winner.

        // This modification would fix a potential flaw with the number of proposals.
        // If the number of proposals is too high, the contract could run out of gas when tallying the votes.
        // By checking the winner after each vote, we can avoid this issue and allow more proposals.

        emit Voted(msg.sender, _id);
    }

    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, InvalidWorkflowStatus(WorkflowStatus.RegisteringVoters, uint256(workflowStatus)));
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        
        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);
        
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, InvalidWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted, uint256(workflowStatus)));
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, InvalidWorkflowStatus(WorkflowStatus.ProposalsRegistrationEnded, uint256(workflowStatus)));
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, InvalidWorkflowStatus(WorkflowStatus.VotingSessionStarted, uint256(workflowStatus)));
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /// @notice Tally the votes
    /// @dev Only the owner can tally the votes
    function tallyVotes() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, InvalidWorkflowStatus(WorkflowStatus.VotingSessionEnded, uint256(workflowStatus)));
        uint _winningProposalId;

        // TODO: Issue 1 - This function would not verify the winner but will officially set the winner.

        for (uint256 p = 0; p < proposalsArray.length; p++) {
            if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
                _winningProposalId = p;
            }
        }
        winningProposalID = _winningProposalId;
        
        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}