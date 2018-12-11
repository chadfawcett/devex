'use strict';

import angular from 'angular';

(() => {
	angular.module('teams').controller('TeamsEditController', [
		'team',
		'editing',
		function(team, editing) {
			const $ctrl = this;
			$ctrl.team = team;
			$ctrl.editing = editing;
		}
	]);
})();
