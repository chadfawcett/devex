'use strict';

import { Document, model, Model, Schema } from 'mongoose';
import CoreServerHelpers from '../../../core/server/controllers/CoreServerHelpers';
import { IProgram } from '../../shared/IProgramDTO';

export interface IProgramModel extends IProgram, Document {
	findUniqueCode(title: string, suffix: string, callback: any): string;
}

const ProgramSchema = new Schema(
	{
		code: { type: String, default: '' },
		title: { type: String, default: '', required: 'Title cannot be blank' },
		short: { type: String, default: '', required: 'Short description cannot be blank' },
		description: { type: String, default: '' },
		owner: { type: String, default: '' },
		website: { type: String, default: '' },
		logo: { type: String, default: 'modules/core/client/img/logo/avatar-2.png' },
		tags: [String],
		isPublished: { type: Boolean, default: false },
		created: { type: Date, default: null },
		createdBy: { type: 'ObjectId', ref: 'User', default: null },
		updated: { type: Date, default: null },
		updatedBy: { type: 'ObjectId', ref: 'User', default: null }
	},
	{ usePushEach: true }
);

ProgramSchema.statics.findUniqueCode = async (title: string, suffix: string, callback): Promise<void> => {
	const uniqueCode = await CoreServerHelpers.modelFindUniqueCode(this, 'pro', title, suffix);
	callback(uniqueCode);
}

export const ProgramModel: Model<IProgramModel> = model<IProgramModel>('Program', ProgramSchema);
