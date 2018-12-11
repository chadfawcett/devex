'use strict';

import _ from 'lodash';
import CoreServerErrors from '../../../core/server/controllers/CoreServerErrors';
import CoreServerHelpers from '../../../core/server/controllers/CoreServerHelpers';
import TeamsModel from '../models/TeamsModel';

class TeamsServerController {
	public static getInstance() {
		return this.instance || (this.instance = new this());
	}

	private static instance: TeamsServerController;

	private constructor() {}

	// REST operation for creating a new team
	public create = (req, res) => {
		const team = new TeamsModel(req.body);

		// Generate a code for the team
		TeamsModel.findUniqueCode(team.name, null, teamCode => {
			team.code = teamCode;

			// Set the audit fields
			CoreServerHelpers.applyAudit(team, req.user);

			team.save(err => {
				if (err) {
					return res.status(422).send({
						message: CoreServerErrors.getErrorMessage(err)
					});
				} else {
					// Update the user with appropriate roles and save
					req.user.addRoles([team.code, `${team.code}-admin`]);
					req.user.save();

					// Return the created team
					res.json(team);
				}
			});
		});
	};

	// REST operation that returns the queried team object
	public read = (req, res) => {
		res.json(req.team);
	};

	// REST operation that updates an existing team
	public update = (req, res) => {
		// Ensure user is an admin for the given team
		if (this.ensureAdmin(req.team, req.user, res)) {
			const team = _.mergeWith(req.team, req.body, (objValue, srcValue) => {
				if (_.isArray(objValue)) {
					return srcValue;
				}
			});

			// Set the audit fields
			CoreServerHelpers.applyAudit(team, req.user);

			// Save and return the updated team
			team.save(err => {
				if (err) {
					return res.status(422).send({
						message: CoreServerErrors.getErrorMessage(err)
					});
				} else {
					res.json(team);
				}
			});
		}
	};

	// REST operation that returns a list of teams
	// Returns all teams for admins, qualified teams for everyone else
	public list = (req, res) => {
		TeamsModel.find(this.getFilterTeamsSearchTerm(req.user))
			.sort('created')
			.exec((err, teams) => {
				if (err) {
					return res.status(422).send({
						message: CoreServerErrors.getErrorMessage(err)
					});
				} else {
					res.json(teams);
				}
			});
	};

	// Utility function that generates a search term for teams
	// based on the user.  Admins get a full list of teams, but
	// other users get only teams that have met membership requirements
	// or teams that they are an admin/member of
	private getFilterTeamsSearchTerm = user => {
		if (user && user.roles.indexOf('admin') !== -1) {
			return {};
		} else {
			return {
				$or: [{ membershipRequirementsMet: true }, { admins: { $in: user } }, { members: { $in: user } }]
			};
		}
	};

	private ensureAdmin = (team, user, res) => {
		if (user.roles.indexOf(`${team.code}-admin`) === -1 && user.roles.indexOf('admin') === -1) {
			res.status(422).send({
				message: 'User Not Authorized'
			});
			return false;
		} else {
			return true;
		}
	};
}

export default TeamsServerController.getInstance();
