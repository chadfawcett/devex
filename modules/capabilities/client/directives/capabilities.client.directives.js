(function () {
	'use strict';
	angular.module ('capabilities')
	// -------------------------------------------------------------------------
	//
	// directive for listing capabilities
	//
	// -------------------------------------------------------------------------
	.directive ('capabilityList', function () {
		return {
			restrict     : 'E',
			controllerAs : 'vm',
			scope        : {
				title       : '@',
				context     : '@',
				capabilities : '='
			},
			templateUrl  : '/modules/capabilities/client/views/list.capabilities.directive.html',
			controller   : ['$sce', '$rootScope', '$scope', 'CapabilitiesService', 'AuthenticationService', function ($sce, $rootScope, $scope, CapabilitiesService, authenticationService) {
				var vm          = this;
				vm.trust        = $sce.trustAsHtml;
				vm.auth         = authenticationService.permissions ();
				vm.title        = ($scope.title) ? $scope.title : null;
				vm.canAdd       = vm.auth.isAdmin;
				vm.context      = $scope.context;
				vm.capabilities = $scope.capabilities;
				$rootScope.$on ('updateCapabilities', function () {
					vm.capabilities = CapabilitiesService.query ();
				});
			}]
		}
	})
	// -------------------------------------------------------------------------
	//
	// directive for viewing a capability, could have several different modes
	//
	// -------------------------------------------------------------------------
	.directive ('capabilityView', function () {
		return {
			restrict     : 'E',
			controllerAs : 'vm',
			scope        : {
				mode       : '@',
				size       : '@',
				capability : '='
			},
			templateUrl  : '/modules/capabilities/client/views/view.capability.directive.html',
			controller   : ['$scope', 'AuthenticationService', function ($scope, AuthenticationService) {
				var vm        = this;
				vm.auth       = AuthenticationService;
				vm.mode       = $scope.mode || 'page';
				vm.canEdit    = vm.auth.isAdmin;
				vm.capability = $scope.capability;
			}]
		}

	})
	;
}());

