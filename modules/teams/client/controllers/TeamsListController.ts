'use strict';

import angular from 'angular';

(() => {
	// Controller for the list of teams
	angular.module('teams').controller('TeamsListController', [
		'TeamsService',
		function(TeamsService) {
			const $ctrl = this;
			// $ctrl.teams = TeamsService.list();
		}
	]);
})();
