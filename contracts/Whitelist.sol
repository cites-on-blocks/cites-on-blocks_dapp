pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";



contract Whitelist is Ownable {

  event AddressWhitelisted(address added, string indexed country);

  mapping (string => address[]) authorityMapping;
  mapping (address => bool) whitelist; //TODO think about => type (as small as possible)

  modifier onlyWhitelisted(){
    require(whitelist[msg.sender]);
    _; 
  }

}



