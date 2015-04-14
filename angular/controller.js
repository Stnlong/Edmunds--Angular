appModule.controller('carController', function ($scope, carFactory, localStorageService, $location) {

	$scope.cars = [];
	$scope.carsToShow = [];
	$scope.compare = [];
	$scope.carPics = [];
	$scope.visibileLinks = [];

	// When the page loads, grab all the makes and models for this year
	carFactory.getNewCars(function (data) {
		console.log("got to the controller, getting cars from factory");
		$scope.cars = data;
		console.log($scope.cars);
	})

	$scope.chartConfig = {
    options: {
      chart: {
        type: 'column'
      },
      plotOptions: {
        series: {
          stacking: ''
        }
      }
    },
    series: $scope.chartSeries,
    title: {
      text: 'Car Comparison'
    },
    credits: {
      enabled: true
    },
    loading: false,
    size: {}
  }

  // Function that searches through the makes and models
	$scope.find = function(input) {
		for(var i = 0; i < $scope.cars.makesCount; i++) {
			for(var j = 0; j< $scope.cars.makes[i].models.length; j++) {
				if(input == $scope.cars.makes[i].models[j].name || input == $scope.cars.makes[i].name) {
					console.log("matching model");
					$scope.carsToShow.push({make:$scope.cars.makes[i].name, model:$scope.cars.makes[i].models[j].name, id:$scope.cars.makes[i].models[j].id});
					console.log($scope.carsToShow);
				}
			}
		}
		
		// if carsToShow is NOT empty, take the array to the factory and have it pull up pictures
		if($scope.carsToShow.length > 0) {
			carFactory.getPics($scope.carsToShow, function (data) {
				$scope.carPics = data;
				console.log(data);
			})
		}
		
		// is the input is empty, clear the results
		if(!input) {
			$scope.carsToShow = [];
			$scope.carPics;
		}
	}
	// Cars that are chosen for comparison are added into the $scope.compare array
	$scope.addToCompare = function(input) {
		$scope.compare.push(input);
		carFactory.addCompare(input, function(data) {
			console.log(data);
		});
	}
	$scope.getNewCars = function() {
		carFactory.getNewCars(function (data) {
			console.log(data);
		})
	}
	$scope.parse = function(input) {
		var replace = input.replace(/_/g, ' ');
		return replace;
	}
	$scope.getCompare = function() {
		return $scope.compare;
	}
	$scope.reset = function() {
		$scope.compare = [];
		carFactory.clearCompare();
	}
})

appModule.controller('compareController', function ($scope, carFactory, localStorageService, $controller){
	$scope.compare = [];
	$scope.gotPics = [];
	$scope.trims = [];
	$scope.tableData = [];
	// Call the function to compare the selected cars
	carFactory.getCompare(function (data) {
		console.log("getting cars to compare from other controller");
		$scope.compare = data;
	})
	// Request API for pictures
	carFactory.getPics($scope.compare, function (output) {
		// return ('https://media.ed.edmunds-media.com/'+replace+'_400.jpg');
		for(var i = 0; i < output.length; i++) {
			if(typeof output[i] == "object") {
				for(var j = 0; j < output[i].length; j++) { 
					if(output[i][j].id.search("fq_oem_*")>0) { 
						var replace = output[i][j].id.replace('dam/photo/', '');
						output[i] = ('https://media.ed.edmunds-media.com/'+replace+'_400.jpg');
						break;
					} 
				}
			}
		}
		$scope.gotPics = output;
		console.log("getpics method returned: ");
		console.log(output);
		return this;
	})
	// Request API for more specific car details
	carFactory.getStyles(function (data) {
		console.log("getting all trim levels");
		console.log(data);
		$scope.trims = data;
	})
	// Set up data variables for Highcharts to plot
	$scope.chartSeries = [];
	$scope.chartSeriesHP = [];
	// Chart series for MPG
	$scope.chartConfigMPG = {
	  options: {
	    chart: {
	      type: 'column'
	    },
	    xAxis: {
	                categories: [
	                    'MPG Highway',
	                    'MPG City'
	                ]
	            },
	            yAxis: {
	                min: 0,
	                title: {
	                    text: 'MPG'
	                }
	            },
	    plotOptions: {
	      column: {
	              pointPadding: 0.2,
	              borderWidth: 0
	          }
	    }
	  },
	  series: $scope.chartSeries,
	  title: {
	    text: 'MPG'
	  },
	  credits: {
	    enabled: true
	  },
	  loading: false,
	  size: {}
	}
	// Chart series for horsepower
	$scope.chartConfigHP = {
	  options: {
	    chart: {
	      type: 'column'
	    },
	    xAxis: {
	                categories: [
	                    'Horsepower'
	                ]
	            },
	            yAxis: {
	                min: 0,
	                title: {
	                    text: 'Horsepower'
	                }
	            },
	    plotOptions: {
	      column: {
	              pointPadding: 0.2,
	              borderWidth: 0
	          }
	    }
	  },
	  series: $scope.chartSeriesHP,
	  title: {
	    text: 'Horsepower'
	  },
	  credits: {
	    enabled: true
	  },
	  loading: false,
	  size: {}
	}
	// When a trim level is selected, the specs for that trim are loaded into Highcharts for comparison
    $scope.addToChart = function (input) {
    	console.log(parseInt(input.engine.horsepower));
    	$scope.chartSeries.push({"name": input.make.name+" "+input.model.name, "data": [parseInt(input.MPG.city), parseInt(input.MPG.highway)]});
    	$scope.chartSeriesHP.push({"name": input.make.name+" "+input.model.name, "data": [input.engine.horsepower]});
    	console.log($scope.chartSeries);
    	$scope.tableData.push(input);
    }
    $scope.compareReset = function() {
    	$scope.compare = [];
    }

})