'use strict';

import angular, { IController, uiNotification } from 'angular';
import { IStateService } from 'angular-ui-router';
import { IAuthenticationService } from '../../../users/client/services/AuthenticationService';
import { ITeamsService } from '../services/TeamsService';

class TeamsListController implements IController {
	public static $inject = ['$state', 'Notification', 'AuthenticationService', 'TeamsService'];
	public isGov: boolean;
	public isAdmin: boolean;
	public userCanAdd: boolean;

	constructor(private $state: IStateService, private Notification: uiNotification.INotificationService, private AuthenticationService: IAuthenticationService, private TeamsService: ITeamsService) {
		this.isAdmin = this.AuthenticationService.user && this.AuthenticationService.user.roles.includes('admin');
		this.isGov = this.AuthenticationService.user && this.AuthenticationService.user.roles.includes('gov');
		this.userCanAdd = this.AuthenticationService.user && (this.isGov || this.isAdmin);
	}

}

angular.module('teams').controller('TeamsListController', TeamsListController);
