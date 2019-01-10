import { IUser } from "../../users/shared/IUserDTO";

export interface ITeam {
    code: string;
    name: string;
    teaser: string;
    description: string;
    logoUrl: string;
    tags: string[];
    repositoryUrl: string;
    admins: IUser[],
    members: IUser[],
    membershipRequirementsMet: boolean;
    created: Date,
    createdBy: IUser,
    updated: Date,
    updatedBy: IUser
}
