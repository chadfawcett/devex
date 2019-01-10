'use strict';

import angular from 'angular';
import { ITeamsService } from '../services/TeamsService';

(() => {
	angular
		.module('teams.routes')
		.config(['$stateProvider', $stateProvider => {
			$stateProvider

			// Abstract, root-level route with ui-view for rendering
			.state('teams', {
				abstract: true,
				url: '/teams',
				template: '<ui-view autoscroll="true"></ui-view>'
			})

			// Route for teams list
			.state('teams.list', {
				url: '',
				templateUrl: '/modules/teams/client/views/teams-list-view.html',
				data: {
					pageTitle: 'Government Teams'
				},
				ncyBreadcrumb: {
					label: 'All Teams'
				},
				resolve: {
					teams: ['TeamsService', async (TeamsService: ITeamsService) => {
						return await TeamsService.list().$promise;
					}]
				},
				controller: 'TeamsListController',
				controllerAs: '$ctrl'
			})

			// Route for viewing individual team
			.state('teams.view', {
				url: '/:teamId',
				templateUrl: '/modules/teams/client/views/team-view.html',
				data: {
					pageTitle: 'Team: {{ team.name }}'
				},
				ncyBreadcrumb: {
					label: '{{ $ctrl.team.name }}',
					parent: 'teams.list'
				},
				resolve: {
					team: ['$stateParams', 'TeamsService', ($stateParams, TeamsService) => {
						return TeamsService.get({
							teamId: $stateParams.teamId
						}).$promise;
					}]
				},
				controller: 'TeamsViewController',
				controllerAs: '$ctrl'
			})

			// Route for editing an individual team
			.state('teams.edit', {
				url: '/:teamId/edit',
				templateUrl: '/modules/teams/client/views/team-edit.html',
				data: {
					roles: ['admin', 'gov'],
					pageTitle: 'Editing Team {{ team.title }}'
				},
				ncyBreadcrumb: {
					label: 'Edit Team',
					parent: 'teams.list'
				},
				resolve: {
					team: ['$stateParams', 'TeamsService', ($stateParams, TeamsService) => {
						return TeamsService.get({
							teamId: $stateParams.teamId
						}).$promise;
					}],
					editing: () => true
				},
				controller: 'TeamsEditController',
				controllerAs: '$ctrl'
			})

			// Route for creating an individual team
			.state('teams.create', {
				url: '/create',
				templateUrl: '/modules/teams/client/views/team-edit.html',
				data: {
					roles: ['admin', 'gov'],
					pageTitle: 'Creating Team'
				},
				ncyBreadcrumb: {
					label: 'New Team',
					parent: 'teams.list'
				},
				resolve: {
					editing: () => false,
					team: ['TeamsService', (TeamsService: ITeamsService) => {
						return new TeamsService();
					}]
				},
				controller: 'TeamEditController',
				controllerAs: '$ctrl'
			})
		}])
})();
