var web3 = new Web3(Web3.givenProvider);
var contractAddress = "0x89B9A346A17e93cA530e564Df86dE52c0ed79CD7";
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
	    contractInstance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]});
	    console.log(contractInstance);
    });
    $("#register_button").click(register_real_estate);
    $("#list-tab").on('shown.bs.tab', list_real_estates);
});

function RealEstateBase(proprietor, externalId, realEstateType, country, city, addressLine) {
	this.proprietor = proprietor;
	this.externalId = externalId;
	this.realEstateType = realEstateType;
	this.country = country;
	this.city = city;
	this.addressLine = addressLine;
}

function register_real_estate(){
	var proprietor = $("#proprietor_input").val();
	var externalId = $("#external_id_input").val();
	var type = $("#type_input").val();
	var latitude = $("#latitude_input").val();
	var longitude = $("#longitude_input").val();
	var height = $("#height_input").val();
	var coordinates = [latitude, longitude, height];
	var country = $("#country_input").val();
	var city = $("#city_input").val();
	var addressLine = $("#address_input").val();

	var config = {
		gas: 6721975
	}
	contractInstance.methods.registerRealEstate(proprietor, externalId, type, coordinates, country, city, addressLine).send(config)
	.on("transactionHash", function(transactionHash){
		console.log(transactionHash);
	})
	.on("confirmation", function(confirmationNr){
		console.log(confirmationNr);
	})
	.on("receipt", function(receipt){
		$("#registration_result_output").text("Real estate successfully registered!");
		console.log(receipt);
	})
}

function list_real_estates(){
	$("#real_estate_table_body").empty();
	contractInstance.methods.totalSupply().call().then(function(totalSupplyResult) {
		for (i = 1; i <= totalSupplyResult; i++) {
			contractInstance.methods.getRealEstatBaseDataById(i).call().then(function(realEstateResult) {
				$('#real_estate_table_body').append(
			    	'<tr><td>' + realEstateResult.proprietor + '</td><td>' 
			    	+ realEstateResult.externalId + '</td><td>' 
			    	+ realEstateResult.realEstateType + '</td><td>' 
			    	+ realEstateResult.country + '</td><td>' 
			    	+ realEstateResult.city + '</td><td>' 
			    	+ realEstateResult.addressLine + '</td></tr>');
			})		  			
		}
	})
}


