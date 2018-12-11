'use strict';

// A model representing a team of government users

import { Model, model, Schema } from 'mongoose';
import ITeamsDocument from '../interfaces/ITeamDocument';

interface ITeamsModel extends Model<ITeamsDocument> {
	findUniqueCode(name: string, suffix: string, callback: any): string;
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

// Utility function for generating a unique code for the team
TeamSchema.statics.findUniqueCode = (name, suffix, callBack) => {
	const possible =
		'team-' +
		name
			.toLowerCase()
			.replace(/\W/g, '-')
			.replace(/-+/, '-') +
		(suffix || '');

	this.findOne(
		{
			code: possible
		},
		(err, user) => {
			if (!err) {
				if (!user) {
					callBack(possible);
				} else {
					return this.findUniqueCode(name, (suffix || 0) + 1, callBack);
				}
			} else {
				callBack(null);
			}
		}
	);
};

// Export a model of the team
const TeamsModel: ITeamsModel = model<ITeamsDocument, ITeamsModel>('Team', TeamSchema);

export default TeamsModel;
