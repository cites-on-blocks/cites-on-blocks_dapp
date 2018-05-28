pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";



contract Whitelist is Ownable {

  event AddressWhitelisted(address added, bytes2 indexed country);
  event CountryRemovedFromWhitelist(bytes2 removed);
  event AddressRemoved(address removed, bytes2 indexed country);

  /**
   * Maps ISO 3166-1 Country Codes to a list of addresses assigned to that country
   */
  mapping (bytes2 => address[]) authorityMapping; 

  /**
   * Maps addresses to a boolean, indicating whether or not an address 
   * is whitelisted
   */
  mapping (address => bool) whitelist; 

  /**
   * Maps addresses to the countries they are located in
   */
  mapping (address => bytes2) authorityToCountry;


  /**
   * Blocks all addresses mapped to false in the whitelist mapping.
   */
  modifier onlyWhitelisted(){
    require(whitelist[msg.sender]);
    _; 
  }

  /**
   * Requires an address to belong to a specific country to proceed.
   */
  modifier whitelistedForCountry(bytes2 countryCode, address addr) {
    require(authorityToCountry[addr]==countryCode);
    _;
  }

  /**
   * Removes a list of addresses from the whitelist by assigning them to false in
   * the whitelist mapping.
   * @param addresses addresses that will be removed from the whitelist
   */
  function removeAddresses(address[] addresses) external onlyOwner {
    for (uint i = 0;i != addresses.length;i++) {
      this.removeAddress(addresses[i]);
    }
  }

  /**
   * Removes a single address from the whitelist mapping by calling the 
   * removeAddresses function.
   * @param toRemove address that will be removed from the whitelist
   */
  function removeAddress(address toRemove) external onlyOwner {
    whitelist[toRemove] = false;
    bytes2 country = authorityToCountry[toRemove];
    emit AddressRemoved(toRemove, country);
  }

  /**
   * Removes addresses of an entire region from the whitelist by calling the
   * removeAddresses function.
   * @param region all addresses of this region will be removed from the whitelist
   */
  function removeCountry(bytes2 region) external onlyOwner {
    address[] memory countryAddresses = authorityMapping[region];
    for (uint i = 0; i!=countryAddresses.length; i++) {
      this.removeAddress(countryAddresses[i]);
    }
    emit CountryRemovedFromWhitelist(region);
  }

  

}



