  
const RealEstateRepository = artifacts.require("RealEstateRepository");
const truffleAssert = require("truffle-assertions");
const BN = web3.utils.BN;

contract("RealEstateRepository", async function(accounts){
	let instance;

	beforeEach(async function() {
		instance = await RealEstateRepository.new();
	});

    afterEach(async function () {
        await instance.destroy();
    });

	it("should register real estate", async function() {
		let proprietor = accounts[1];
		let externalId = "123";
		let realEstateType = "apartment";
		let latitude = 123123123;
		let longitude = 234234234;
		let height = 111111111;
		let coordinates = [latitude, longitude, height];
		let country = "Hungary";
		let city = "Velence";
		let addressLine = "Enyedi utca 25";
		let result = await instance.registerRealEstate(proprietor, externalId, realEstateType, coordinates, country, city, addressLine);
		truffleAssert.eventEmitted(result, 'RealEstateRegistration');
		truffleAssert.eventEmitted(result, 'RealEstateRegistration', (e) => {
					return e.proprietor === accounts[1]
                        && e.externalId === "123"
                        && e.realEstateType === "apartment"
                        && e.latitude.toNumber() === 123123123
                        && e.longitude.toNumber() === 234234234
                        && e.height.toNumber() === 111111111
                        && e.country === "Hungary"
                        && e.city === "Velence"
                        && e.addressLine === "Enyedi utca 25";
                }, 'event params incorrect');
	});

	it("should return the registered real estate by id", async function() {
		let proprietor = accounts[0];
		let externalId = "123";
		let realEstateType = "apartment";
		let latitude = 123123123;
		let longitude = 234234234;
		let height = 111111111;
		let coordinates = [latitude, longitude, height];
		let country = "Hungary";
		let city = "Velence";
		let addressLine = "Enyedi utca 25";
		await instance.registerRealEstate(proprietor, externalId, realEstateType, coordinates, country, city, addressLine);
		let realEstate = await instance.getRealEstatBaseDataById(1);
		assert(realEstate.realEstateType === realEstateType);
		assert(realEstate.externalId === externalId);
		assert(realEstate.country === country);
		assert(realEstate.city === city);
		assert(realEstate.addressLine === addressLine);
	});

});

