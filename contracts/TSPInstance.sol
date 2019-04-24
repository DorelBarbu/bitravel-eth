pragma solidity ^0.4.17;

contract TSPInstance {
    /**
     * The total amount of money recieved for solving the TSP problem *
    */
    uint public reward;
    
    /**
     * Each miner will try to test one possible path and calculate it's cost.
     * A given path is a permutation of {1,2,...,problemSize}. The next miner
     * who joins will pick up the index-th permutation in lexicographical order
     * and compute the cost 
    **/
    uint public index;
    
    /**
     * The number of nodes that the graph has
    **/
    uint public problemSize;
    
    /**
     * Holds the solution to the problem. It will be updated as soon
     * as a miner finds a better solution
     * 
    **/
    uint public minimumCost;
    
    /**
     * Holds the addresses of all the miners that are currently
     * working on solving the problem
    **/
    address[] public contributor;
    
    /**
     * Hold the number of possibilities that each contributor tested.
    **/
    mapping(address => uint) public contributorEffort;
    
    /**
     * MongoDB object Id for the TSP TSPInstance.
     * The graph will be found in the database at id tspInstanceAddress.
    **/
    string public tspInstanceAddress;
    
    function TSPInstance(uint size, string tspAddress) public payable {
        reward = msg.value;
        problemSize = size;
        tspInstanceAddress = tspAddress;
        index = 1;
        minimumCost = 0;
    }
    
    /**
     * Updates the minimum cost with the result from a miner. The miner has the option
     * to try another possiblity or give up and cash in the reward
    */
    function updateMinimumCost(uint currentCost) public payable {
        bool alreadyContributed = false;
        for(uint i = 0; i < contributor.length; i++) {
            if(contributor[i] == msg.sender) {
                alreadyContributed = true;
                break;
            }
        }
        if(alreadyContributed == false) {
            contributor.push(msg.sender);
        }
        contributorEffort[msg.sender]++;
        if(currentCost < minimumCost || minimumCost == 0) {
            minimumCost = currentCost;
        }
    }
    
    /**
     * Retrieves the address of the deplyoed TSPInstance contract
    */
    function getAdress() public view returns(address) {
        return this;
    }
    
    function setReward() public payable {
        reward = msg.value;
    }
    
    function getNumberOfContributors() public view returns(uint) {
        return contributor.length;
    }
    
    function getContributors() public view returns(address[]) {
        return contributor;
    }
    
    function incrementIndex() public payable returns(uint) {
        index++;
    }
}

contract TSPInstanceFactory {
    event CreatedTSPInstanceEvent(address contractAddress);
    address[] public deployedTSPInstances;

    function TSPInstanceFactory() public payable {}
    
    function createTSPInstance(uint size, string tspAddress) public payable {
        TSPInstance newTSPInstance = new TSPInstance(size, tspAddress);
        deployedTSPInstances.push(newTSPInstance);
        CreatedTSPInstanceEvent(newTSPInstance);
    }
    
    function getDeployedTSPInstances() public view returns(address[])  {
        return deployedTSPInstances;
    }
}