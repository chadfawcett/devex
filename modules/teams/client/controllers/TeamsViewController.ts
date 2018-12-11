'use strict';

import angular from 'angular';

(() => {
	angular.module('teams').controller('TeamsViewController', [
		'team',
		function(team) {
			const $ctrl = this;
			$ctrl.team = team;
		}
	]);
})();
