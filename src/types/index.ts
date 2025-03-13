import type { QueryObject } from 'nhb-toolbox/dist/object/types';
import type { Location } from 'react-router';

export type LocationState = Location<{
	from?: {
		pathname: string;
	};
}>;

export interface DBItem {
	_id: string;
	createdAt: string;
	updatedAt: string;
}

export interface IQueryParams extends QueryObject {
	search?: string | number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	filter?: string;
	page?: number;
	limit?: number;
	min?: number;
	max?: number;
	ids?: string[];
	exclude?: `-${string}`[];
}

export interface ICartItem {
	id: string;
	cartQuantity: number;
	date: string;
}

export interface ICartState {
	items: ICartItem[];
	total: number;
}
