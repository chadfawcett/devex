'use strict';

import angular from 'angular';

(() => {
	angular
		.module('projects')
		.run(['menuService', (menuService) => {
			menuService.addMenuItem('topbar', {
				title: 'Teams',
				state: 'teams.list',
				roles: ['*'],
				icon: 'none',
				position: 3
			})
		}])
})();
