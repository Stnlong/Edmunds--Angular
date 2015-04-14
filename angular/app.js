var appModule = angular.module('app', ['ngRoute', 'LocalStorageModule', 'highcharts-ng']);

appModule.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'main.html'
		})
		.when('/compare', {
			templateUrl: 'compare.html',
			controller: 'compareController'
		})

})