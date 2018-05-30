pragma solidity ^0.4.23;

import "./Whitelist.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


/**
 * @title PermitFactory contract
 * @dev Contains all CITES permit related functions.
 * @author Dong-Ha Kim, Lukas Renner
 */
contract PermitFactory is Whitelist {

  // Initialize the safe math data types.
  using SafeMath for uint256;


  /*
   * Structures
   */

  /**
   * A permit object as digital representation of a real permit provided as paper.
   * Contains a bunch of information to describe this permit.
   * A permit is between to countries, the exporting and importing one.
   * With a permit a set of specimens get exported, which are linked here.
   * Each permit gets a numeric nonce value to make sure this permit gets unique.
   */
  struct Permit {
    bytes2 exportCountry; // ISO country code of export country
    bytes2 importCountry; // ISO country code of import country
    uint8 permitType; // type of permit: 0 -> Export, 1 -> Re-Export, 2 -> Other
    bytes32[3] exporter; // name and address of exporter: ["name", "street", "city"]
    bytes32[3] importer; // name and address of importer: ["name", "street", "city"]
    bytes32[] specimenHashes; // hashes of specimens
    uint nonce; // used to create unique hash
  }

  /**
   * As part of a permit, it describes the exported specimens.
   * Each specimen object is for one type of specimen.
   * It contains a bunch of information to describe this partial export.
   * Each permit has a backward relation to its permit.
   * Species can get linked to a new permit, if they get re-exported.
   * Nonetheless it always keeps its relation to the origin permit, where it gets created
   * for.
   */
  struct Specimen {
    bytes32 permitHash; // hash of parent permit
    uint quantity; // quantity of specimen
    bytes32 scientificName; // scientific name of species
    bytes32 commmonName; // common name of specimen
    bytes32 description; // description of specimen
    bytes32 originHash; // permit hash of origin permit
    bytes32 reExportHash; // permit hash of last re-export
  }


  /*
   * Events
   */

  /**
   * Will be thrown when a new permit has been created.
   * Also if the permit itself has been already created, this event is thrown after all
   * specimen objects related to this permit have been created as well.
   */
  event PermitCreated (
    bytes32 indexed permitHash,
    bytes2 indexed exportCountry,
    bytes2 indexed importCountry
  );

  /**
   * Will be thrown when a part gets confirmed by an authority.
   * Contains also the information if the permit was accepted or not.
   */
  event PermitConfirmed (
    bytes32 indexed permitHash,
    bytes2 indexed exportCountry,
    bytes2 indexed importCountry,
    bool isAccepted
  );


  /*
   * Global Variables
   */

  uint permitNonce = 1; // Used to generate unique hash values for permit objects and all related objects as well.
  mapping (bytes32 => Permit) public permits; // Used to store permits to their identifying hash values.
  mapping (bytes32 => Specimen) public specimens; // Used to store specimens to their identifying hash values.
  mapping (bytes32 => bool) public confirmed; // Maps the hash values of permits to the flag if they have been confirmed.
  mapping (bytes32 => bool) public accepted; // Maps the hash values of permits to the flag if they have been accepted.


  /**
   * Create a new permit object and register it.
   *
   * @dev Called by CITES authority in exporting country.
   * @dev Digital permit flow.
   * @param _exportCountry ISO country code of exporting country
   * @param _importCountry ISO country code of importing country
   * @param _permitType type of permit: 1 -> Export, 2 -> Re-Export, 3 -> Other
   * @param _exporter name and address of exporter: ["name", "street", "city"]
   * @param _importer name and address of importer: ["name", "street", "city"]
   * @param _quantities quantities of specimens
   * @param _scientificNames sc. names of specimens
   * @param _commonNames common names of specimens
   * @param _descriptions specimen descriptions
   * @param _originHashes hashes of origin permits of specimens
   * @param _reExportHashes hashes of last re-export permits of specimens
   */
  function createPermit(
    bytes2 _exportCountry,
    bytes2 _importCountry,
    uint8 _permitType,
    bytes32[3] _exporter,
    bytes32[3] _importer,
    uint[] _quantities,
    bytes32[] _scientificNames,
    bytes32[] _commonNames,
    bytes32[] _descriptions,
    bytes32[] _originHashes,
    bytes32[] _reExportHashes
  )
    public
    onlyWhitelisted
    whitelistedForCountry(_exportCountry, msg.sender)
  {
    _createPermit(
      _exportCountry,
      _importCountry,
      _permitType,
      _exporter,
      _importer,
      _quantities,
      _scientificNames,
      _commonNames,
      _descriptions,
      _originHashes,
      _reExportHashes
    );
  }

  /**
   * Create a new paper permit object and register it.
   *
   * @dev Called by CITES authority in importing country.
   * @dev Paper-based permit flow.
   * @param _exportCountry ISO country code of exporting country
   * @param _importCountry ISO country code of importing country
   * @param _permitType type of permit: 1 -> Export, 2 -> Re-Export, 3 -> Other
   * @param _exporter name and address of exporter: ["name", "street", "city"]
   * @param _importer name and address of importer: ["name", "street", "city"]
   * @param _quantities quantities of specimens
   * @param _scientificNames sc. names of specimens
   * @param _commonNames common names of specimens
   * @param _descriptions specimen descriptions
   * @param _originHashes hashes of origin permits of specimens
   * @param _reExportHashes hashes of last re-export permits of specimens
   */
  function createPaperPermit(
    bytes2 _exportCountry,
    bytes2 _importCountry,
    uint8 _permitType,
    bytes32[3] _exporter,
    bytes32[3] _importer,
    uint[] _quantities,
    bytes32[] _scientificNames,
    bytes32[] _commonNames,
    bytes32[] _descriptions,
    bytes32[] _originHashes,
    bytes32[] _reExportHashes
  )
    public
    onlyWhitelisted
    whitelistedForCountry(_importCountry, msg.sender)
  {
    _createPermit(
      _exportCountry,
      _importCountry,
      _permitType,
      _exporter,
      _importer,
      _quantities,
      _scientificNames,
      _commonNames,
      _descriptions,
      _originHashes,
      _reExportHashes
    );
  }

  /**
   * Mark a permit as confirmed and set the accepted flag.
   * Requires that all the permit and specimen hashes exist.
   * Required that the permit is not confirmed already.
   *
   * @dev Called by CITES authority.
   * @param _permitHash hash of permit that gets confirmed
   * @param _specimenHashes hashes of specimens
   * @param _isAccepted whether permit got imported or not
   */
  function confirmPermit(
    bytes32 _permitHash,
    bytes32[] _specimenHashes,
    bool _isAccepted
  )
    public
    onlyWhitelisted
  {
    // Make sure the permit is not confirmed already.
    require(!confirmed[_permitHash]);

    // Check all provided hash values for to exist.
    require(permits[_permitHash].nonce > 0);

    for (uint i = 0; i < _specimenHashes.length; i++) {
      require(specimens[_specimenHashes[i]].permitHash == _permitHash);
    }

    // Mark the permit as confirmed and set the acceptance mapping.
    confirmed[_permitHash] = true;
    accepted[_permitHash] = _isAccepted;

    emit PermitConfirmed(
      _permitHash,
      permits[_permitHash].exportCountry,
      permits[_permitHash].importCountry,
      _isAccepted
    );
  }

  /**
   * Generate a unique hash value for a permit.
   * Use a bunch of attributes to retrieve this value.
   *
   * @dev Returns unique hash of permit.
   * @param _exportCountry ISO country code of export country
   * @param _importCountry ISO country code of import country
   * @param _permitType type of permit: 1 -> Export, 2 -> Re-Export, 3 -> Other
   * @param _exporter name and address of exporter: ["name", "street", "city"]
   * @param _importer name and address of importer: ["name", "street", "city"]
   * @param _nonce number used to create unique hash
   * @return unique permit hash
   */
  function _getPermitHash(
    bytes2 _exportCountry,
    bytes2 _importCountry,
    uint8 _permitType,
    bytes32[3] _exporter,
    bytes32[3] _importer,
    uint _nonce
  )
    private
    pure
    returns (bytes32)
  {
    return keccak256(
      abi.encodePacked(
        _exportCountry,
        _importCountry,
        _permitType,
        _exporter,
        _importer,
        _nonce
      )
    );
  }

  /**
   * Generate a unique hash value for a specimen.
   * Use a bunch of attributes to retrieve this value.
   *
   * @dev Returns unique hash of specimen.
   * @param _permitHash hash parent permit
   * @param _quantity quantity of specimen
   * @param _scientificName sc. name of specimen
   * @param _commonName common name of specimen
   * @param _description description of specimen
   * @param _originHash hash of origin permit of specimen
   * @param _reExportHash hash of last re-export permit of specimen
   * @return unique specimen hash
   */
  function _getSpecimenHash(
    bytes32 _permitHash,
    uint _quantity,
    bytes32 _scientificName,
    bytes32 _commonName,
    bytes32 _description,
    bytes32 _originHash,
    bytes32 _reExportHash
  )
    private
    pure
    returns (bytes32)
  {
    return keccak256(
      abi.encodePacked(
        _permitHash,
        _quantity,
        _scientificName,
        _commonName,
        _description,
        _originHash,
        _reExportHash
      )
    );
  }

  /**
   * Retrieve the permit object for a given hash value as key.
   * Require that the hash value exists.
   *
   * Do not check if a permit exists for this hash value.
   * @dev Custom getter function to retrieve permit from contract storage.
   * @dev Needed because client can not directly get array from mapping.
   * @param _permitHash hash of permit
   * @return permit as tuple
   */
  function getPermit(bytes32 _permitHash)
    public
    view
    returns (bytes2, bytes2, uint8, bytes32[3], bytes32[3], bytes32[], uint)
  {
    // Check if a permit for this hash exist.
    // Cause the initial nonce is zero, all permits must have a nonce with a higher value.
    require(permits[_permitHash].nonce > 0);

    // Build a tuple with the attributes of the permit object.
    return (
      permits[_permitHash].exportCountry,
      permits[_permitHash].importCountry,
      permits[_permitHash].permitType,
      permits[_permitHash].exporter,
      permits[_permitHash].importer,
      permits[_permitHash].specimenHashes,
      permits[_permitHash].nonce
    );
  }

  /**
   * @dev Creates a CITES permit and stores it in the contract.
   * @dev A hash of the permit is used as an unique key.
   * @param _exportCountry ISO country code of exporting country
   * @param _importCountry ISO country code of importing country
   * @param _permitType type of permit: 1 -> Export, 2 -> Re-Export, 3 -> Other
   * @param _exporter name and address of exporter: ["name", "street", "city"]
   * @param _importer name and address of importer: ["name", "street", "city"]
   * @param _quantities quantities of specimens
   * @param _scientificNames sc. names of specimens
   * @param _commonNames common names of specimens
   * @param _descriptions specimen descriptions
   * @param _originHashes hashes of origin permits of specimens
   * @param _reExportHashes hashes of last re-export permits of specimens
   */
  function _createPermit(
    bytes2 _exportCountry,
    bytes2 _importCountry,
    uint8 _permitType,
    bytes32[3] _exporter,
    bytes32[3] _importer,
    uint[] _quantities,
    bytes32[] _scientificNames,
    bytes32[] _commonNames,
    bytes32[] _descriptions,
    bytes32[] _originHashes,
    bytes32[] _reExportHashes
  )
    private
  {
    // Create the new permit by the provided values.
    Permit memory permit = Permit({
      exportCountry: _exportCountry,
      importCountry: _importCountry,
      permitType: _permitType,
      exporter: _exporter,
      importer: _importer,
      specimenHashes: new bytes32[](_quantities.length),
      nonce: permitNonce
    });

    // Generate the unique hash to store the permit.
    bytes32 permitHash = _getPermitHash(
      permit.exportCountry,
      permit.importCountry,
      permit.permitType,
      permit.exporter,
      permit.importer,
      permit.nonce
    );

    permits[permitHash] = permit;


    // Call to add new specimens.
    _addSpecimens(
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
      permit.exportCountry,
      permit.importCountry
    );

    // Increase the permit nonce to get continuously unique hash values.
    permitNonce = permitNonce.add(1);
  }

  /**
   * @dev Helper function that creates specimens and stores them in the contract.
   * @dev Also adds created specimens to related permit.
   * @param _permitHash hash of related permit
   * @param _quantities quantities of specimens
   * @param _scientificNames sc. names of specimens
   * @param _commonNames common names of specimens
   * @param _descriptions specimen descriptions
   * @param _originHashes hashes of origin permits of specimens
   * @param _reExportHashes hashes of last re-export permits of specimens
   */
  function _addSpecimens(
    bytes32 _permitHash,
    uint[] _quantities,
    bytes32[] _scientificNames,
    bytes32[] _commonNames,
    bytes32[] _descriptions,
    bytes32[] _originHashes,
    bytes32[] _reExportHashes
  )
    private
  {
    // Do this for all defined specimens.
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
      bytes32 specimenHash = _getSpecimenHash(
        specimen.permitHash,
        specimen.quantity,
        specimen.scientificName,
        specimen.commmonName,
        specimen.description,
        specimen.originHash,
        specimen.reExportHash
      );
      permits[_permitHash].specimenHashes[i] = specimenHash;
      specimens[specimenHash] = specimen;
    }
  }
}
