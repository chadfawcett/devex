'use strict';

import angular from 'angular';

(() => {
	angular.module('teams.services').factory('TeamsService', [
		'$resource',
		$resource => {
			const Team = $resource(
				'/api/teams/:teamId',
				{
					teamId: '@_id'
				},
				{
					create: {
						method: 'POST'
					},
					update: {
						method: 'PUT'
					},
					remove: {
						method: 'DELETE'
					},
					list: {
						method: 'GET',
						url: '/api/teams',
						isArray: true
					}
				}
			);

			return Team;
		}
	]);
})();
