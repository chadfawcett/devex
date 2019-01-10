'use strict';

import angular, { IController, uiNotification } from 'angular';
import { IStateService } from 'angular-ui-router';
import { IUserService } from '../../../users/client/services/UsersService';
import { ITeamResource, ITeamsService } from '../services/TeamsService';

class TeamEditController implements IController {
	public static $inject = ['$state', 'Notification', 'TeamsService', 'UsersService', 'team', 'editing'];
	constructor(
		private $state: IStateService,
		private Notification: uiNotification.INotificationService,
		private TeamsService: ITeamsService,
		private UsersService: IUserService,
		public team: ITeamResource,
		public editing: boolean
	) {}

	public async save(): Promise<void> {
		let updatedTeam: ITeamResource;
		try {
			if (this.editing) {
				updatedTeam = await this.TeamsService.update(this.team).$promise;
			} else {
				updatedTeam = await this.TeamsService.create(this.team).$promise;
			}
			this.refreshTeam(updatedTeam);
		} catch (error) {
			this.handleError(error);
		}
	}

	private refreshTeam(newTeam: ITeamResource): void {
		this.team = newTeam;
	}

	private handleError(error: any): void {
		const errorMessage = (error as any).data ? (error as any).data.message : error.message;
		this.Notification.error({
			title: 'Error',
			message: `<i class="fas fa-exclamation-triangle"></i> ${errorMessage}`
		});
	}
}

angular.module('teams').controller('TeamEditController', TeamEditController);
