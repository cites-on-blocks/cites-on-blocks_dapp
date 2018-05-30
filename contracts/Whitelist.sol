pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract Whitelist is Ownable {

  event AddressWhitelisted(address added, bytes2 indexed country);
  event CountryRemovedFromWhitelist(bytes2 removed);
  event AddressRemoved(address removed, bytes2 indexed country);

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
   * Removes a list of addresses from the whitelist.
   * @dev Is a wrapper function for the removeAddresses function.
   * @param _addressList addresses that will be removed from the whitelist
   */
  function removeAddresses(address[] _addressList) external onlyOwner {
    // Make sure any address has been passed.
    require(_addressList.length > 0);

    // Call removeAddress for each entry in the list.
    for (uint i = 0; i < _addressList.length; i++) {
      removeAddress(_addressList[i]);
    }
  }

  /**
   * Removes addresses of an entire country from the whitelist. by calling the
   * @dev Is a wrapper function for the removeAddresses function.
   * @param _country all addresses of this region will be removed from the whitelist
   */
  function removeCountry(bytes2 _country) external onlyOwner {
    // Make sure the passed country exist.
    require(authorityMapping[_country].length > 0);

    address[] memory countryAddresses = authorityMapping[_country];

    for (uint i = 0; i < countryAddresses.length; i++) {
      removeAddress(countryAddresses[i]);

    }
    emit CountryRemovedFromWhitelist(_country);
  }

  /**
   * Adds an address to all mappings needed for the whitelist.
   * @param _toAdd - address to be added to the whitelist
   * @param  _country - country the address belongs to
   */
  function addAddress(address _toAdd, bytes2 _country) public onlyOwner {
    // In case the address is a new one, set also the country mappings.
    // Use the authority to country mapping, cause the whitelist mappings can't be used
    // with booleans as values, but the country code are null bytes if not defined.
    if (authorityToCountry[_toAdd] == 0x0) {
      authorityMapping[_country].push(_toAdd);
      authorityToCountry[_toAdd] = _country;
    } else {
      // Make sure the caller has the correct intention.
      // Throw an error, cause the user should know that it is not possible to change the country code later
      // on.
      require(authorityToCountry[_toAdd] == _country);
    }

    // Enable the address, whatever it is a new one or not.
    whitelist[_toAdd] = true;

    emit AddressWhitelisted(_toAdd, _country);
  }

  /**
   * Removes a single address from the whitelist.
   * @dev Remove means to set the address mapped value to false.
   * @param _toRemove address that will be removed from the whitelist
   */
  function removeAddress(address _toRemove) public onlyOwner {
    // Make sure the address is defined.
    require(authorityToCountry[_toRemove] != 0x0);

    // Disable the address.
    whitelist[_toRemove] = false;

    bytes2 country = authorityToCountry[_toRemove];
    emit AddressRemoved(_toRemove, country);
  }

}
