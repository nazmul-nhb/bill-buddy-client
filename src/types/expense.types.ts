import type { Dayjs } from 'dayjs';
import type { EXPENSE_TYPES, PAYMENT_TYPES } from '../configs/constants';
import type { DBItem, UploadPreview } from './index';
import type { ISingleUser } from './user.types';

export interface IExpenseData {
	items: string;
	expenseType: (typeof EXPENSE_TYPES)[number];
	paymentType: (typeof PAYMENT_TYPES)[number];
	cost: number;
	receipt?: File | UploadPreview[];
	originalTime: string | Dayjs;
}

export interface IExpenseDetails extends DBItem, Omit<IExpenseData, 'receipt'> {
	receipt?: string;
	createdBy: ISingleUser;
}

export interface IExpense extends Omit<IExpenseDetails, 'createdBy'> {
	receipt?: string;
	createdBy: string;
}

export interface IExpenseResponse {
	total: number;
	count: number;
	currentPage: number;
	totalPages: number;
	minPrice: number;
	maxPrice: number;
	expenses: IExpenseDetails[];
}
