appModule.factory('carFactory', function($http) {
	var cars = [];
	var carStyleID = [];
	var carPics = [];
	var carsToCompare = [];
	var factory = {};
	// This API request returns all the new makes and models
	factory.getNewCars = function(callback) {
		$http.get('https://api.edmunds.com/api/vehicle/v2/makes?state=new&year=2015&view=basic&fmt=json&api_key=dkgp2amr29shtxgrt34d5r53').success(function(output) {
			cars = output;
			callback(cars);
		})
	}
	// This API requests pictures for each car that's been marked for comparison
	factory.getPics = function(input, callback) {
		for(var i = 0; i < input.length; i++) {
			// First request the specific model details
			$http.get('https://api.edmunds.com/api/vehicle/v2/'+input[i].make+'/'+input[i].model+'/2015/styles?state=new&view=full&fmt=json&api_key=dkgp2amr29shtxgrt34d5r53').success(function(output) {
				carStyleID.push(output);
				callback(carStyleID);
				console.log(output.styles[0].id);
				// Then request the pictures based on the returned model details
				$http.get('https://api.edmunds.com/v1/api/vehiclephoto/service/findphotosbystyleid?styleId='+output.styles[0].id+'&fmt=json&api_key=dkgp2amr29shtxgrt34d5r53').success(function(output1) {
					carPics.push(output1);
					callback(carPics);
				})
				
			})

		}
	}
	// This function filters out JSON data for easier Angular access
	factory.getStyles = function(callback) {
		for(var i = 0; i < carStyleID.length; i++) {
			carStyleID[i] = carStyleID[i].styles;
		}
		callback(carStyleID);
	}
	factory.addCompare = function(input, callback) {
		carsToCompare.push(input);
		callback(carsToCompare);
	}
	factory.getCompare = function(callback) {
		callback(carsToCompare);
	}
	factory.clearCompare = function() {
		carsToCompare = [];
	}

	return factory
});