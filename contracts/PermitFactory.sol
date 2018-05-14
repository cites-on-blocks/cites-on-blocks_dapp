pragma solidity ^0.4.2;

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
		string[] exNameAndAddress; // name and address of exporter: ["name", "street", "city"]
		string[] imNameAndAddress; // name and address of importer: ["name", "street", "city"]
		bytes32[] specimens; // specimen hashes of permit
	}

	struct Specimen {
		uint quantity; // quantity of specimen
		string scientificName; // scientific name of species
		string commmonName; // common name of specied
		string description; // description of specimen
		bytes32 originHash; // permit hash of origin permit
		bytes32 reExportHash; // permit hash of last re-export
	}

	mapping (bytes32 => Permit) permits;
	mapping (bytes32 => Specimen) specimens;

	event PermitCreated (
		bytes32 indexed permitHash,
		address indexed exporter,
		address indexed importer
	);
	
	function createPermit(
		address _importer, // address of importing country
		uint8 _permitType, // type of permit: 1 -> Export, 2 -> Re-Export, 3 -> Other
		string[] _exNameAndAddress, // name and address of exporter: ["name", "street", "city"]
		string[] _imNameAndAddress, // name and address of importer: ["name", "street", "city"]
		uint[] _quantities, // quantities of specimens
		string[] _scientificNames, // scientific names of specimens
		string[] _commonNames, // common names of specimens
		bytes32[] _originHashes, // origin hashes of specimens
		bytes32[] _reExportHashes // re-export hashes of specimens
	) public // TODO add modifiers
	{
		bytes32[] specimenHashes;
		for (uint i = 0; i < _quantities.length; i++) {
			
		}
		Specimen memory
		Permit memory permit = Permit({
			exporter: msg.sender,
			importer: _importer,
			permitType: _permitType,
			exNameAndAddresses: _exNameAndAddresses,
			imNameAndAddresses: _imNameAndAddresses
		})
    emit PermitCreated(
			keccak256(order.makerToken, order.takerToken),
			exporter,
			importer
		);
    return true;
  }
}