'use strict';

// A model representing a team of government users

import { Document, Model, model, Schema } from 'mongoose';
import CoreServerHelpers from '../../../core/server/controllers/CoreServerHelpers';
import { ITeam } from '../../shared/ITeamDTO';

export interface ITeamsModel extends ITeam, Document {
	findUniqueCode(name: string, suffix: string): Promise<string>;
}

// MongoDB schema for the team
const TeamSchema = new Schema(
	{
		code: { type: String, default: '' },
		name: {
			type: String,
			default: '',
			required: 'A team name is required',
			trim: true
		},
		teaser: { type: String, default: '', trim: true },
		description: {
			type: String,
			default: '',
			required: 'A team description is required',
			trim: true
		},
		logoUrl: {
			type: String,
			default: 'modules/core/client/img/logo/avatar-2.png'
		},
		tags: { type: [String], default: [] },
		repositoryUrl: {
			type: String,
			default: '',
			trim: true
		},
		admins: { type: [Schema.Types.ObjectId], ref: 'User' },
		members: { type: [Schema.Types.ObjectId], ref: 'User' },
		membershipRequirementsMet: { type: Boolean, default: false },
		created: { type: Date, default: Date.now },
		createdBy: { type: Schema.Types.ObjectId, default: null },
		updated: { type: Date, default: Date.now },
		updatedBy: { type: Schema.Types.ObjectId, default: null }
	},
	{ usePushEach: true }
);

// Export a model of the team
export const TeamsModel: Model<ITeamsModel> = model<ITeamsModel>('Team', TeamSchema);

// Utility function for generating a unique code for the team
TeamSchema.statics.findUniqueCode = async (name: string, suffix: string): Promise<string> => {
	return await CoreServerHelpers.modelFindUniqueCode(TeamsModel, 'team', name, suffix);
};
