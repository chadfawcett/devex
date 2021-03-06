'use strict';

import angular, { IRootScopeService, uiNotification } from 'angular';
import { IStateService } from 'angular-ui-router';
import { IAuthenticationService } from '../../../users/client/services/AuthenticationService';
import { ICapabilitiesService, ICapabilityResource } from '../services/CapabilitiesService';
import { ICapabilitySkillResource, ICapabilitySkillsService } from '../services/CapabilitiesSkillsService';

(() => {
	angular
		.module('capabilities')
		// Controller the view of the capability page
		.controller('CapabilityEditController', [
			'$scope',
			'$state',
			'capability',
			'AuthenticationService',
			'Notification',
			'TINYMCE_OPTIONS',
			'CapabilitiesService',
			'CapabilitySkillsService',
			'ask',
			function(
				$scope: IRootScopeService,
				$state: IStateService,
				capability: ICapabilityResource,
				AuthenticationService: IAuthenticationService,
				Notification: uiNotification.INotificationService,
				TINYMCE_OPTIONS,
				CapabilitiesService: ICapabilitiesService,
				CapabilitySkillsService: ICapabilitySkillsService,
				ask
			) {
				const qqq = this;
				qqq.capability = capability;
				qqq.auth = AuthenticationService.permissions();
				qqq.tinymceOptions = TINYMCE_OPTIONS;
				qqq.newskill = '';
				qqq.editingskill = false;

				// check for duplicate skills
				qqq.isDuplicateSkill = (newSkillName: string, existingSkills: ICapabilitySkillResource[]): boolean => {
					let found = false;
					let i = 0;
					while (!found && i < existingSkills.length) {
						found = existingSkills[i++].name.toLowerCase() === newSkillName.toLowerCase();
					}
					return found;
				};

				// save the capability, could be added or edited (post or put)
				qqq.savenow = async (isValid: boolean): Promise<void> => {
					if (!isValid) {
						$scope.$broadcast('show-errors-check-validity', 'qqq.capabilityForm');
						return;
					}

					try {
						let newCapability: ICapabilityResource;
						if (qqq.capability._id) {
							newCapability = await CapabilitiesService.update(qqq.capability).$promise;
						} else {
							newCapability = await CapabilitiesService.create(qqq.capability).$promise;
						}
						qqq.capabilityForm.$setPristine();
						Notification.success({
							message: '<i class="fas fa-check-circle"></i> Capability saved'
						});
						qqq.capability = newCapability;
						return;
					} catch (error) {
						Notification.error({
							message: "<i class='fas fa-exclamation-triangle'></i> Save failed: " + error
						});
						return;
					}
				};

				// add a new capability skill
				qqq.addSkill = async (): Promise<void> => {
					// leave if no string
					if (!qqq.newskill) {
						Notification.error({
							message: 'No Skill was supplied',
							title: "<i class='fas fa-exclamation-triangle'></i> Missing Skill"
						});
						qqq.newskill = '';
						return;
					}

					// check that this is not a duplicate within the current set
					qqq.capability.skills = qqq.capability.skills ? qqq.capability.skills : [];
					if (qqq.isDuplicateSkill(qqq.newskill, qqq.capability.skills)) {
						Notification.error({
							message: 'Duplicate Skill',
							title: "<i class='fas fa-exclamation-triangle'></i> Duplicate Skill"
						});
						qqq.newskill = '';
						return;
					}

					const capabilitySkill: any = {
						name: qqq.newskill
					};

					try {
						const newSkill = await CapabilitySkillsService.create(capabilitySkill).$promise;
						qqq.capability.skills.push(newSkill);
						qqq.savenow(true);
						qqq.newskill = '';
						qqq.capabilityForm.$setPristine();
						return;
					} catch (error) {
						Notification.error({
							title: 'Error',
							message: "<i class='fas fa-exclamation-triangle'></i> Error Saving Skill"
						});
						return;
					}
				};

				// enter edit mode for a skill
				qqq.editSkill = (capabilitySkill: ICapabilitySkillResource): void => {
					qqq.newskill = capabilitySkill.name;
					qqq.editingskill = capabilitySkill;
				};

				// update a skill
				qqq.updateSkill = async (): Promise<void> => {
					// leave if no string
					if (!qqq.newskill) {
						Notification.error({
							message: 'No Skill was supplied',
							title: "<i class='fas fa-exclamation-triangle'></i> Missing Skill"
						});
						qqq.newskill = '';
						return;
					}

					// check that this is not a duplicate within the current set
					if (!qqq.editingskill) {
						if (qqq.isDuplicateSkill(qqq.newskill, qqq.capability.skills)) {
							Notification.error({
								title: "<i class='fas fa-exclamation-triangle'></i> Duplicate Skill"
							});
							qqq.newskill = '';
							return;
						}
					}

					qqq.editingskill.name = qqq.newskill;

					try {
						await CapabilitySkillsService.update(qqq.editingskill).$promise;
						Notification.success({
							message: '<i class="fas fa-check-circle"></i> Skill updated'
						});
						qqq.newskill = '';
						qqq.editingskill = null;
						qqq.capabilityForm.$setPristine();
						return;
					} catch (error) {
						Notification.error({
							title: 'Error',
							message: "<i class='fas fa-exclamation-triangle'></i> Error Updating Skill"
						});
						return;
					}
				};

				// delete a skill - confirm first
				qqq.deleteSkill = async (capabilitySkill: ICapabilitySkillResource): Promise<void> => {
					const question = 'Confirm you want to delete this skill.  This cannot be undone.';
					const response = await ask.yesNo(question);
					if (response) {
						try {
							await CapabilitySkillsService.remove({ capabilityskillId: capabilitySkill._id }).$promise;
							qqq.capability.skills = qqq.capability.skills.reduce((accum, current) => {
								if (current.code !== capabilitySkill.code) {
									accum.push(current);
								}
								return accum;
							}, []);
							qqq.savenow(true);
							return;
						} catch (error) {
							Notification.error({
								title: 'Error',
								message: "<i class='fas fa-exclamation-triangle'></i> Error Removing Skill"
							});
							return;
						}
					}
				};

				// remove the capability with some confirmation
				qqq.remove = async (): Promise<void> => {
					const question = 'Confirm you want to delete this capability.  This cannot be undone.';
					const response = await ask.yesNo(question);
					if (response) {
						try {
							qqq.capability.skills.forEach(
								async (capabilitySkill: ICapabilitySkillResource): Promise<void> => {
									await CapabilitySkillsService.remove({ capabilityskillId: capabilitySkill._id }).$promise;
								}
							);

							await CapabilitiesService.remove({ capabilityId: capability._id }).$promise;
							$state.go('capabilities.list');
							Notification.success({
								message: '<i class="fas fa-check-circle"></i> Capability deleted'
							});
							return;
						} catch (error) {
							Notification.error({
								title: 'Error',
								message: "<i class='fas fa-exclamation-triangle'></i> Error Removing Capability"
							});
							return;
						}
					}
				};

				// close the edit view and return to the capability list or capability view
				qqq.close = (): void => {
					if (qqq.capability._id) {
						$state.go('capabilities.view', { capabilityId: qqq.capability._id });
					} else {
						$state.go('capabilities.list');
					}
				};
			}
		]);
})();
