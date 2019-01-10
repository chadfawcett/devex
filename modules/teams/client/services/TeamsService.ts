'use strict';

import angular, { IPromise, resource } from 'angular';
import { ITeam } from '../../shared/ITeamDTO';

export interface ITeamResource extends resource.IResource<ITeam>, ITeam {
	teamId: '@_id';
	$promise: IPromise<ITeamResource>;
}

export interface ITeamsService extends resource.IResourceClass<ITeamResource> {
	create(team: ITeamResource): ITeamResource;
	update(team: ITeamResource): ITeamResource;
	list(): ITeamResource[];
}

angular.module('teams.services').factory('TeamsService', [
	'$resource',
	($resource: resource.IResourceService): ITeamsService => {
		const createAction: resource.IActionDescriptor = {
			method: 'POST'
		};

		const updateAction: resource.IActionDescriptor = {
			method: 'PUT'
		};

		const listAction: resource.IActionDescriptor = {
			method: 'GET',
			url: '/api/teams',
			isArray: true
		};

		return $resource(
			'/api/teams/:teamId',
			{
				teamId: '@_id'
			},
			{
				create: createAction,
				update: updateAction,
				list: listAction
			}
		) as ITeamsService;
	}
]);
