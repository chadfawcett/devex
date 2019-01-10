'use strict';

import { Document, model, Model, Schema } from 'mongoose';
import CoreServerHelpers from '../../../core/server/controllers/CoreServerHelpers';
import { ICapability } from '../../shared/ICapabilityDTO';

export interface ICapabilityModel extends ICapability, Document {
	_id: any;
	findUniqueCode(title: string, suffix: string): Promise<string>;
}

const CapabilitySchema = new Schema(
	{
		code: { type: String, default: '' },
		name: { type: String, required: 'Capability Name Is Required' },
		description: { type: String, default: '' },
		skills: {
			type: [{ type: Schema.Types.ObjectId, ref: 'CapabilitySkill' }],
			default: []
		},
		isRequired: { type: Boolean, default: true },
		isInception: { type: Boolean, default: true },
		isPrototype: { type: Boolean, default: true },
		isImplementation: { type: Boolean, default: true },
		labelClass: { type: String, default: '' }
	},
	{ usePushEach: true }
);

CapabilitySchema.statics.findUniqueCode = async (title: string, suffix: string): Promise<string> => {
	return await CoreServerHelpers.modelFindUniqueCode(CapabilityModel, 'capability', title, suffix);
};

export const CapabilityModel: Model<ICapabilityModel> = model<ICapabilityModel>('Capability', CapabilitySchema);
