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
    bytes32[3] exNameAndAddress; // name and address of exporter: ["name", "street", "city"]
    bytes32[3] imNameAndAddress; // name and address of importer: ["name", "street", "city"]
    bytes32[] specimenHashes; // specimens
    uint nonce; // used to create unique hash
  }
  
  struct Specimen {
    bytes32 permitHash; // hash of parent permit
    uint quantity; // quantity of specimen
    bytes32 scientificName; // scientific name of species
    bytes32 commmonName; // common name of specied
    bytes32 description; // description of specimen
    bytes32 originHash; // permit hash of origin permit
    bytes32 reExportHash; // permit hash of last re-export
  }
  
  uint permitNonce = 0; // used to generate unique hash
  mapping (bytes32 => Permit) public permits; // maps hash to permit
  mapping (bytes32 => Specimen) public specimens; // maps hash to specimen

  event PermitCreated (
    bytes32 indexed permitHash,
    address indexed exporter,
    address indexed importer
  );
  
  function createPermit(
    address _importer, // address of importing country
    uint8 _permitType, // type of permit: 1 -> Export, 2 -> Re-Export, 3 -> Other
    bytes32[3] _exNameAndAddress, // name and address of exporter: ["name", "street", "city"]
    bytes32[3] _imNameAndAddress, // name and address of importer: ["name", "street", "city"]
    uint[] _quantities, // quantities of specimens
    bytes32[] _scientificNames, // scientific names of specimens
    bytes32[] _commonNames, // common names of specimens
    bytes32[] _descriptions, // descriptions of specimens
    bytes32[] _originHashes, // origin hashes of specimens
    bytes32[] _reExportHashes // re-export hashes of specimens
  ) 
    public
    // TODO modifiers
    returns (bool)
  {
    Permit memory permit = Permit({
      exporter: msg.sender,
      importer: _importer,
      permitType: _permitType,
      exNameAndAddress: _exNameAndAddress,
      imNameAndAddress: _imNameAndAddress,
      specimenHashes: new bytes32[](_quantities.length),
      nonce: permitNonce
    });
    bytes32 permitHash = getPermitHash(
      permit.exporter,
      permit.importer,
      permit.permitType,
      permit.exNameAndAddress,
      permit.imNameAndAddress,
      permit.nonce
    );
    permits[permitHash] = permit;
    addSpecimenToPermit(
      permitHash,
      _quantities,
      _scientificNames,
      _commonNames,
      _descriptions,
      _originHashes,
      _reExportHashes
    );
    emit PermitCreated(
      permitHash,
      permit.exporter,
      permit.importer
    );
    permitNonce++;    
    return true;
  }

  function addSpecimenToPermit(
    bytes32 _permitHash,
    uint[] _quantities, // quantities of specimens
    bytes32[] _scientificNames, // scientific names of specimens
    bytes32[] _commonNames, // common names of specimens
    bytes32[] _descriptions, // descriptions of specimens
    bytes32[] _originHashes, // origin hashes of specimens
    bytes32[] _reExportHashes // re-exporhashes of specimens
  )
    private
    returns (bool)
  {
    for (uint i = 0; i < _quantities.length; i++) {
      Specimen memory specimen = Specimen(
        _permitHash,
        _quantities[i],
        _scientificNames[i],
        _commonNames[i],
        _descriptions[i],
        _originHashes[i],
        _reExportHashes[i]
      );
      bytes32 specimenHash = getSpecimenHash(
        specimen.permitHash,
        specimen.quantity,
        specimen.scientificName,
        specimen.commmonName,
        specimen.description,
        specimen.originHash,
        specimen.reExportHash
      );
      permits[_permitHash].specimenHashes.push(specimenHash);
      specimens[specimenHash] = specimen;
    }
    return true;
  }

  function getPermitHash(
    address _exporter,
    address _importer,
    uint8 _permitType,
    bytes32[3] _exNameAndAddress,
    bytes32[3] _imNameAndAddress,
    uint _nonce
  ) 
    public
    pure
    returns (bytes32)
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

  function getSpecimenHash(
    bytes32 _permitHash,
    uint _quantity,
    bytes32 _scientificName,
    bytes32 _commonName,
    bytes32 _description,
    bytes32 _originHash,
    bytes32 _reExportHash
  ) 
    public
    pure
    returns (bytes32)
  {
    return keccak256(
      _permitHash,
      _quantity,
      _scientificName,
      _commonName,
      _description,
      _originHash,
      _reExportHash
    );
  }

  function getPermit(bytes32 permitHash)
    public
    view
    returns (address, address, uint8, bytes32[3], bytes32[3], bytes32[], uint)
  {
    return (
      permits[permitHash].exporter,
      permits[permitHash].importer,
      permits[permitHash].permitType,
      permits[permitHash].exNameAndAddress,
      permits[permitHash].imNameAndAddress,
      permits[permitHash].specimenHashes,
      permits[permitHash].nonce
    );
  }
}