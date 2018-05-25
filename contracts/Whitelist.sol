pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";



contract Whitelist is Ownable {

  event AddressWhitelisted(address added, bytes2 indexed country);

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
  modifier whitelistedForCountry(bytes2 _countryCode, address _addr) {
    require(authorityToCountry[_addr] == _countryCode);
    _;
  }


  /**
   * Adds an address to all mappings needed for the whitelist.
   * @param _toAdd - address to be added to the whitelist
   * @param  _country - country the address belongs to
   */
  function addAddress(address _toAdd, bytes2 _country) external onlyOwner {
    // Only add address if it is a new one.
    require(!whitelist[_toAdd]);

    // Add it to all associated mappings.
    whitelist[_toAdd] = true;
    authorityMapping[_country].push(_toAdd);
    authorityToCountry[_toAdd] = _country;

    emit AddressWhitelisted(_toAdd, _country);
  }


}



