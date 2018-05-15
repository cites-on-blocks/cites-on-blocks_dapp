pragma solidity ^0.4.23;


contract PermitFactory {

  enum PermitTypes {
    EXPORT,
    RE_EXPORT,
    OTHER
  }
  
  struct Permit {
    address exporter; // address of export authority
    address importer; // address of import authority
    uint8 permitType; // type of permit: 1 -> Export, 2 -> Re-Export, 3 -> Other
    bytes32[] exNameAndAddress; // name and address of exporter: ["name", "street", "city"]
    bytes32[] imNameAndAddress; // name and address of importer: ["name", "street", "city"]
    mapping(uint => Specimen) specimens; // specimens
  }
  
  struct Specimen {
    uint quantity; // quantity of specimen
    bytes32 scientificName; // scientific name of species
    bytes32 commmonName; // common name of specied
    bytes32 description; // description of specimen
    bytes32 originHash; // permit hash of origin permit
    bytes32 reExportHash; // permit hash of last re-export
  }
  
  uint permitCount = 0; // used to generate unique hash
  mapping (bytes32 => Permit) permits; // maps hash to permit

  event PermitCreated (
    bytes32 indexed permitHash,
    address indexed exporter,
    address indexed importer
  );
  
  function createPermit(
    address _importer, // address of importing country
    uint8 _permitType, // type of permit: 1 -> Export, 2 -> Re-Export, 3 -> Other
    bytes32[] _exNameAndAddress, // name and address of exporter: ["name", "street", "city"]
    bytes32[] _imNameAndAddress, // name and address of importer: ["name", "street", "city"]
    uint[] _quantities, // quantities of specimens
    bytes32[] _scientificNames, // scientific names of specimens
    bytes32[] _commonNames, // common names of specimens
    bytes32[] _descriptions, // descriptions of specimens
    bytes32[] _originHashes, // origin hashes of specimens
    bytes32[] _reExportHashes // re-export hashes of specimens
  ) public returns (bool) // TODO add modifiers
  {
    Permit memory permit = Permit({
      exporter: msg.sender,
      importer: _importer,
      permitType: _permitType,
      exNameAndAddress: _exNameAndAddress,
      imNameAndAddress: _imNameAndAddress
    });
    bytes32 permitHash = getPermitHash(
      msg.sender,
      _importer,
      _permitType,
      _exNameAndAddress,
      _imNameAndAddress,
      permitCount
    );
    permits[permitHash] = permit;
    permitCount++;
    for (uint i = 0; i < _quantities.length; i++) {
      permits[permitHash].specimens[i] = Specimen(
        _quantities[i],
        _scientificNames[i],
        _commonNames[i],
        _descriptions[i],
        _originHashes[i],
        _reExportHashes[i]
      );
    }
    emit PermitCreated(
      permitHash,
      permit.exporter,
      permit.importer
    );
    return true;
  }

  function getPermitHash(
    address _exporter,
    address _importer,
    uint8 _permitType,
    bytes32[] _exNameAndAddress,
    bytes32[] _imNameAndAddress,
    uint _nonce
  ) public pure returns (bytes32)
  {
    return keccak256(
      _exporter,
      _importer,
      _permitType,
      _exNameAndAddress,
      _imNameAndAddress,
      _nonce
    );
  }
}