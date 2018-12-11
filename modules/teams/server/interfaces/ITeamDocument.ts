import { Document } from 'mongoose';
import IUserDocument from '../../../users/server/interfaces/IUserDocument';

export default interface ITeamDocument extends Document {
	code: string;
	name: string;
	teaser: string;
	description: string;
	logoUrl: string;
	tags: string[];
	repositoryUrl: string;
	admins: IUserDocument[];
	members: IUserDocument[];
	membershipRequirementsMet: boolean;
	created: Date;
	createdBy: IUserDocument;
	updated: Date;
	updatedBy: IUserDocument;
}
