import type { ISingleUser } from './user.types';

export interface IGenericResponse {
	success: boolean;
	message: string;
	status: number;
}

export interface IServerResponse<T> extends IGenericResponse {
	data?: T;
}

export interface ILoginResponse {
	user: ISingleUser;
	token: string;
}

export interface IError {
	name: string;
	path: string | number;
	message: string;
}

export interface IErrorResponse extends IGenericResponse {
	errors: IError[];
}
