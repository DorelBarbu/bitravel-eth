pragma solidity ^0.4.17;
import "./TSPInstance.sol";

contract TSPInstanceFactory {
    address[] public deployedTSPInstances;
    
    function createTSPInstance(uint size, string tspAddress) public {
        TSPInstance newTSPInstance = new TSPInstance(size, tspAddress);
        deployedTSPInstances.push(newTSPInstance);
    }
    
    function getDeployedTSPInstances() public view returns(address[])  {
        return deployedTSPInstances;
    } 
}