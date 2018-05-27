pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";



contract Whitelist is Ownable {

  event AddressWhitelisted(address added, bytes2 indexed country);

  /**
   * Maps ISO 3166-1 Country Codes to a list of addresses assigned to that country.
   */
  mapping (bytes2 => address[]) public authorityMapping;

  /**
   * Maps addresses to a boolean, indicating whether or not an address
   * is whitelisted
   */
  mapping (address => bool) public whitelist;

  /**
   * Maps addresses to the countries they are located in
   */
  mapping (address => bytes2) public authorityToCountry;

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
   * Add all addresses defined in the list with the same country code to the whitelist.
   * @dev Only a wrapper function for {@link addAddress}.
   *
   * @param _addressList - the list of addresses to add
   * @param _country - country all addresses belongs to
   */
  function addAddresses(address[] _addressList, bytes2 _country) external onlyOwner {
    // Make sure any address has been passed.
    require(_addressList.length > 0);

    // Call addAddress for each entry in the list.
    for (uint i = 0; i < _addressList.length; i++) {
      addAddress(_addressList[i], _country);
    }
  }

  /**
   * Adds an address to all mappings needed for the whitelist.
   * @param _toAdd - address to be added to the whitelist
   * @param  _country - country the address belongs to
   */
  function addAddress(address _toAdd, bytes2 _country) public onlyOwner {
    // Only add address if it is a new one.
    require(!whitelist[_toAdd]);

    // Add it to all associated mappings.
    whitelist[_toAdd] = true;
    authorityMapping[_country].push(_toAdd);
    authorityToCountry[_toAdd] = _country;

    emit AddressWhitelisted(_toAdd, _country);
  }


}



