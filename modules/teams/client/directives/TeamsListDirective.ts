'use strict';

import angular from 'angular';

(() => {
	angular.module('teams')
	.directive('teamsList', () => {
		return {
			restrict: 'E',
			controllerAs: '$ctrl',
			scope: {
				teams: '='
			},
			templateUrl: '/modules/teams/client/views/teams-list-directive.html',
			controller: [
				'$scope',
				function($scope) {
					const $ctrl = this;
					$ctrl.teams = $scope.teams;
				}
			]
		}
	});
})();
