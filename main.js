const IpfsHttpClient = require('ipfs-http-client')
const ipfs = IpfsHttpClient({host: 'ipfs.infura.io', port: '5001', protocol: 'https'})

var web3 = new Web3(Web3.givenProvider);
var contractAddress = "0x9D61F1DFa764a4cAd11ddFDb3aF7Ffa2ea96A8D0";
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
	    contractInstance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]});
	    console.log(contractInstance);
    });
    $("#register_button").click(register_real_estate);
    $("#list-tab").on('shown.bs.tab', list_real_estates);
});

function register_real_estate(){
	var proprietor = $("#proprietor_input").val();
	let jsonData = {
		"proprietor": proprietor,
		"externalId": $("#external_id_input").val(),
		"type": $("#type_input").val(),
		"latitude": $("#latitude_input").val(),
		"longitude": $("#longitude_input").val(),
		"height": $("#height_input").val(),
		"country": $("#country_input").val(),
		"city": $("#city_input").val(),
		"addressLine": $("#address_input").val()
	}
	ipfs.add(Buffer.from(JSON.stringify(jsonData))).then(function(value) {
		var config = {
			gas: 6721975
		}
		contractInstance.methods.registerRealEstate(proprietor, value[0].hash).send(config)
		.on("transactionHash", function(transactionHash){
			console.log(transactionHash);
		})
		.on("confirmation", function(confirmationNr){
			console.log(confirmationNr);
		})
		.on("receipt", function(receipt){
			$("#registration_result_output").text("Real estate successfully registered!");
			console.log(receipt);
		});

  	});
}

function list_real_estates(){
	$("#real_estate_table_body").empty();
	contractInstance.methods.totalSupply().call().then(function(totalSupplyResult) {
		for (let i = 1; i <= totalSupplyResult; i++) {
			contractInstance.methods.tokenURI(i).call().then(function(tokenURI) {
				ipfs.cat(tokenURI, function (err, file) {
				    if(err) throw err;
				    let jsonData = JSON.parse(file);
				    $('#real_estate_table_body').append(
				    	'<tr><td>' + jsonData.proprietor + '</td><td>' 
				    	+ jsonData.externalId + '</td><td>' 
				    	+ jsonData.type + '</td><td>' 
				    	+ jsonData.country + '</td><td>' 
				    	+ jsonData.city + '</td><td>' 
				    	+ jsonData.addressLine + '</td></tr>');
				});
			})
		}
	})
}


