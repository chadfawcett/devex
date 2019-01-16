'use strict';

// Import certain style elements here so that webpack picks them up
import '@fortawesome/fontawesome-free/js/all';
import angular, { IController, IRootScopeService } from 'angular';
import { IState, IStateParamsService, IStateService } from 'angular-ui-router';
import '../../../../public/sass/theme.scss';
import { IAuthenticationService } from '../../../users/client/services/AuthenticationService';
import '../css/bl_checkbox.css';
import '../css/core.css';

class HomeController implements IController {
	public static $inject = ['AuthenticationService', '$state', '$rootScope'];
	public isUser: boolean;

	constructor(private AuthenticationService: IAuthenticationService, private $state: IStateService, private $rootScope: IRootScopeService) {
		this.isUser = !!this.AuthenticationService.user;

		if (sessionStorage.prevState) {
			const prevState = sessionStorage.prevState as IState;
			const prevParams = JSON.parse(sessionStorage.prevParams) as IStateParamsService;
			delete sessionStorage.prevState;
			delete sessionStorage.prevParams;
			this.$state.go(prevState, prevParams);
		}
	}
}

angular.module('core').controller('HomeController', HomeController);
