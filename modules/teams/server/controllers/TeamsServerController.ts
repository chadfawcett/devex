'use strict';

import { Request, Response } from 'express';
import _ from 'lodash';
import CoreServerErrors from '../../../core/server/controllers/CoreServerErrors';
import CoreServerHelpers from '../../../core/server/controllers/CoreServerHelpers';
import { IUserModel } from '../../../users/server/models/UserModel';
import { ITeamsModel, TeamsModel } from '../models/TeamsModel';

class TeamsServerController {
	public static getInstance() {
		return this.instance || (this.instance = new this());
	}

	private static instance: TeamsServerController;

	private constructor() {
		this.create = this.create.bind(this);
		this.update = this.update.bind(this);
		this.list = this.list.bind(this);
	}

	// REST operation for creating a new team
	public async create(req: Request, res: Response): Promise<void> {
		const team = new TeamsModel(req.body);

		// Generate a code for the team
		team.code = await TeamsModel.schema.statics.findUniqueCode(team.name, null);

		// Set audit fields
		CoreServerHelpers.applyAudit(team, req.user);

		// save team, update user, then return new team in response
		try {
			const newTeam = await team.save();
			req.user.addRoles([team.code, `${team.code}-admin`]);
			await req.user.save();

			res.json(newTeam);
		} catch (error) {
			res.status(422).send({
				message: CoreServerErrors.getErrorMessage(error)
			});
		}
	}

	// REST operation that returns the queried team object
	public async read(req: Request, res: Response): Promise<void> {
		res.json(req.team);
	}

	// REST operation that updates an existing team - requires admin
	public async update(req: Request, res: Response): Promise<void> {
		// If not admin, return as no-op
		if (!this.ensureAdmin(req.team, req.user, res)) {
			return;
		}

		const newTeamInfo = req.body;

		// Set the audit fields
		CoreServerHelpers.applyAudit(newTeamInfo, req.user);

		try {
			const updatedTeam = await TeamsModel.findOneAndUpdate({ code: req.team.code }, newTeamInfo, { new: true });
			res.json(updatedTeam);
		} catch (error) {
			res.status(422).send({
				message: CoreServerErrors.getErrorMessage(error)
			});
		}
	}

	// REST operation that returns a list of teams
	// Returns all teams for admins, qualified teams for everyone else
	public async list(req: Request, res: Response): Promise<void> {
		try {
			const teams = await TeamsModel.find(this.getFilterTeamsSearchTerm(req.user))
				.sort('created')
				.exec();
			res.json(teams);
		} catch (error) {
			res.status(422).send({
				message: CoreServerErrors.getErrorMessage(error)
			});
		}
	}

	// REST operation for deleting the given team - requires admin
	public async delete(req: Request, res: Response): Promise<void> {
		if (!this.ensureAdmin(req.team, req.user, res)) {
			return;
		}

		try {
			const removedTeam = await req.team.remove();
			res.json(removedTeam);
		} catch (error) {
			res.status(422).send({
				message: CoreServerErrors.getErrorMessage(error)
			});
		}
	}

	// Utility function that generates a search term for teams
	// based on the user.  Admins get a full list of teams, but
	// other users get only teams that have met membership requirements
	// or teams that they are an admin/member of
	private getFilterTeamsSearchTerm(user: IUserModel): any {
		if (user && user.roles.includes('admin')) {
			return {};
		} else {
			return {
				$or: [{ membershipRequirementsMet: true }, { admins: { $in: user } }, { members: { $in: user } }]
			};
		}
	}

	// Internal function that takes a team and user and ensures
	// that the user is an admin for that team.  Emits a 403 response
	// if the user is not an admin
	private ensureAdmin(team: ITeamsModel, user: IUserModel, res: Response): boolean {
		if (!user.roles.includes(`${team.code}-admin`) && !user.roles.includes('admin')) {
			res.status(403).send({
				message: 'User Not Authorized'
			});
			return false;
		} else {
			return true;
		}
	}
}

export default TeamsServerController.getInstance();
