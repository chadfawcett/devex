'use strict';

import { Document, Model, model, Schema } from 'mongoose';
import CoreServerHelpers from '../../../core/server/controllers/CoreServerHelpers';
import { IProject } from '../../shared/IProjectDTO';

export interface IProjectModel extends IProject, Document {
	findUniqueCode(title: string, suffix: string, callback: any): string;
}

const ProjectSchema = new Schema(
	{
		code: { type: String, default: '' },
		name: {
			type: String,
			default: '',
			required: 'Please fill the project name',
			trim: true
		},
		short: {
			type: String,
			default: '',
			required: 'Please complete the project short description',
			trim: true
		},
		description: {
			type: String,
			default: '',
			required: 'Please complete the project description',
			trim: true
		},
		github: {
			type: String,
			default: '',
			trim: true
		},
		isPublished: { type: Boolean, default: false },
		wasPublished: { type: Boolean, default: false },
		created: {
			type: Date,
			default: Date.now
		},
		createdBy: {
			type: 'ObjectId',
			ref: 'User',
			default: null
		},
		updated: {
			type: Date,
			default: Date.now
		},
		updatedBy: {
			type: 'ObjectId',
			ref: 'User',
			default: null
		},
		program: {
			type: Schema.Types.ObjectId,
			ref: 'Program',
			required: 'Please select a program'
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		activity: { type: Number, default: 1 },
		tags: [String]
	},
	{ usePushEach: true }
);

ProjectSchema.statics.findUniqueCode = async (title: string, suffix: string, callback) => {
	const uniqueCode = await CoreServerHelpers.modelFindUniqueCode(this, 'prj', title, suffix);
	callback(uniqueCode);
};

export const ProjectModel: Model<IProjectModel> = model<IProjectModel>('Project', ProjectSchema);
