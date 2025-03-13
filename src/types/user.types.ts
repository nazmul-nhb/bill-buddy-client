import type { JwtPayload } from 'jwt-decode';
import type { USER_ROLES } from '../configs/constants';

export type TUserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface ICredentials {
	email: string;
	password: string;
}

export interface IRegisterUser extends ICredentials {
	name: string;
	image: File;
	confirm_password: string;
}

export interface IDecodedUser extends JwtPayload {
	email: string;
	role: TUserRole;
}

export interface INewUser {
	_id: string;
	name: string;
	email: string;
	image: string;
}

export interface ISingleUser extends INewUser {
	role: TUserRole;
	isActive?: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ILoggedInState {
	user: ISingleUser | null;
	token: string | null;
}
