import { generateQueryParams } from 'nhb-toolbox';
import type { IQueryParams } from '../../types';
import type { IExpense, IExpenseDetails } from '../../types/expense.types';
import type { IServerResponse } from '../../types/server.types';
import { baseApi } from './baseApi';

export const expenseApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		createExpense: builder.mutation<IServerResponse<IExpense>, FormData>({
			query: (formData) => ({
				url: 'expenses',
				method: 'POST',
				body: formData,
			}),
			invalidatesTags: ['Expenses'],
		}),

		getAllExpenses: builder.query<IServerResponse<IExpenseDetails[]>, IQueryParams>({
			query: (queryObject) => {
				const queryParams = generateQueryParams(queryObject);

				return {
					url: `expenses`.concat(queryParams),
					method: 'GET',
				};
			},
			providesTags: ['Expenses'],
		}),

		getSingleExpense: builder.query<
			IServerResponse<IExpenseDetails>,
			string | undefined
		>({
			query: (id) => ({
				url: `expenses/`.concat(id!),
				method: 'GET',
			}),
			providesTags: (_r, _e, id) => [{ id, type: 'Expense' }],
		}),

		deleteExpense: builder.mutation<IServerResponse<void>, string>({
			query: (id) => ({
				url: `expenses/`.concat(id),
				method: 'DELETE',
			}),
			invalidatesTags: (_r, _e, id) => [
				{ id, type: 'Expense' },
				{ type: 'Expenses' },
			],
		}),

		updateExpense: builder.mutation<
			IServerResponse<void>,
			{ id: string; data: FormData }
		>({
			query: ({ id, data }) => ({
				url: `expenses/`.concat(id),
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: (_r, _e, { id }) => [
				{ id, type: 'Expense' },
				{ type: 'Expenses' },
			],
		}),
	}),
	overrideExisting: false,
});

export const {
	useCreateExpenseMutation,
	useGetSingleExpenseQuery,
	useGetAllExpensesQuery,
	useDeleteExpenseMutation,
	useUpdateExpenseMutation,
} = expenseApi;
