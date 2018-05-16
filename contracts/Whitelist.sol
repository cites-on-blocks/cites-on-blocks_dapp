pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";



contract Whitelist is Ownable {

  event AddressWhitelisted(address added, string indexed country);

  /*
  To be able to remove whole countries from the whitelist, we map a countrycode to 
  all addresses related to that country.

  All whitelisted addresses are assigned "true" in the whitelist mapping. If we want
  to remove an address from the whitelist, we simply assign it "false" in the
  witelist mapping.
  
  */
  mapping (string => address[]) authorityMapping;
  mapping (address => bool) whitelist; //TODO think about => type (as small as possible)


  /**
    Blocks all addresses mapped to false in the whitelist mapping.
   */
  modifier onlyWhitelisted(){
    require(whitelist[msg.sender]);
    _; 
  }

}



