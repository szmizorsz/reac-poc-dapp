pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StringUtils.sol";  

contract RealEstateRepository is ERC721, Ownable {
    using StringUtils for address;
    using Counters for Counters.Counter;
    Counters.Counter private _ids;

    uint8 public constant coordinate_decimals = 7;

	struct RealEstate {
	    string externalId;
	    string realEstateType;
	    uint256 latitude;
	    uint256 longitude;
	    uint256 height;
	    string country;
	    string city;
	    string addressLine;
	}

	/**
	 * @dev NFT ID to real estate object mapping.
	 */
	mapping(uint256 => RealEstate) internal idToRealEstate;

	event RealEstateRegistration(uint id, address proprietor, string externalId, string realEstateType, uint latitude, uint longitude, uint height, string country, string city, string addressLine);

    constructor() public ERC721("Real estate coin", "RESC") {}

    function registerRealEstate(
    	address proprietor, 
    	string memory _externalId,
    	string memory _realEstateType,
	    uint256[3] memory coordinates,
    	string memory _country,
    	string memory _city,
    	string memory _addressLine
    	)
        public
    {
        _ids.increment();

        uint256 newItemId = _ids.current();
        _mint(proprietor, newItemId);

        RealEstate memory newRealEstate;
        newRealEstate.externalId = _externalId;
        newRealEstate.realEstateType = _realEstateType;
        newRealEstate.latitude = coordinates[0];
        newRealEstate.longitude = coordinates[1];
        newRealEstate.height = coordinates[2];
        newRealEstate.country = _country;
        newRealEstate.city = _city;
        newRealEstate.addressLine = _addressLine;

        idToRealEstate[newItemId] = newRealEstate;

		emit RealEstateRegistration(newItemId, proprietor, _externalId, _realEstateType, coordinates[0], coordinates[1], coordinates[2], _country, _city, _addressLine);
    }

    function getRealEstatBaseDataById(uint256 id) public view returns(
        string memory proprietor,
    	string memory externalId, 
    	string memory realEstateType,
    	string memory country,
    	string memory city,
    	string memory addressLine
    	){
        return (ownerOf(id).toString(),
            idToRealEstate[id].externalId, 
        	idToRealEstate[id].realEstateType,
        	idToRealEstate[id].country,
        	idToRealEstate[id].city,
        	idToRealEstate[id].addressLine);
    }

    function getRealEstateCoordinatesById(uint256 id) public view returns(
    	uint256 latitude,
    	uint256 longitude,
    	uint256 height
    	){
        return (idToRealEstate[id].latitude,
        	idToRealEstate[id].longitude,
        	idToRealEstate[id].height);
    }

    function destroy() external onlyOwner {
        require(msg.sender == owner());
        selfdestruct(msg.sender);   }  
}