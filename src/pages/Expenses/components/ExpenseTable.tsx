import { Icon } from '@iconify/react';
import { Button, Flex, Popconfirm, Spin, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { capitalizeString } from 'nhb-toolbox';
import { Fragment, useState } from 'react';
import {
	useDeleteExpenseMutation,
	useGetAllExpensesQuery,
} from '../../../app/api/expenseApi';
import AntdTable from '../../../components/AntdTable';
import { useNotifyResponse } from '../../../hooks/useNotifyResponse';
import { useTheme } from '../../../hooks/useTheme';
import type { IExpenseDetails } from '../../../types/expense.types';
import { formatDateTimeDynamic, getTimeStamp } from '../../../utils/dates';
import { generateFilters } from '../../../utils/helpers';

const ExpenseTable = () => {
	const { isDarkTheme } = useTheme();
	const { handleError, handleSuccess } = useNotifyResponse();

	const [isDrawerVisible, setDrawerVisible] = useState(false);

	const { expenses, isLoading } = useGetAllExpensesQuery(
		{ limit: 0 },
		{
			selectFromResult: ({ data, ...rest }) => ({
				expenses: data?.data,
				...rest,
			}),
		}
	);

	console.log(expenses);

	const [selectedExpenseId, setSelectedExpenseId] = useState<string>('');

	const [deleteExpense] = useDeleteExpenseMutation();

	const handleDeleteExpense = async (id: string) => {
		try {
			const res = await deleteExpense(id).unwrap();

			if (res.success) {
				handleSuccess(res);
			}
		} catch (error) {
			handleError(error);
		}
	};

	// console.log({ data, queryParams });

	const ExpensesColumn: ColumnsType<IExpenseDetails> = [
		{
			title: 'Items',
			dataIndex: 'items',
			key: 'items',
			sorter: (a, b) => a.items.localeCompare(b.items),
		},
		{
			title: 'Expense Type',
			dataIndex: 'expenseType',
			key: 'expenseType',
			filters: generateFilters(expenses as IExpenseDetails[], 'expenseType'),
			onFilter: (value, expense) => expense.expenseType === value,
			sorter: (a, b) => a.expenseType.localeCompare(b.expenseType),
			render: (expenseType: IExpenseDetails['expenseType']) => (
				<Tag color={expenseType === 'food' ? 'cyan' : 'blue'}>
					{capitalizeString(expenseType)}
				</Tag>
			),
		},
		{
			title: 'Cost',
			dataIndex: 'cost',
			key: 'cost',
			sorter: (a, b) => a.cost - b.cost,
			render: (cost: number) => <span>৳ {cost}</span>,
		},
		{
			title: 'Payment Type',
			dataIndex: 'paymentType',
			key: 'paymentType',
			filters: generateFilters(expenses as IExpenseDetails[], 'paymentType'),
			filterSearch: true,
			onFilter: (paymentType, expense) =>
				expense.paymentType.startsWith(paymentType as string),
			sorter: (a, b) => a.paymentType.localeCompare(b.paymentType),
			render: (paymentType: IExpenseDetails['paymentType']) => (
				<Tag color={paymentType === 'due' ? 'error' : 'success'}>
					{capitalizeString(paymentType)}
				</Tag>
			),
		},
		{
			title: 'Created By',
			dataIndex: 'createdBy',
			key: 'createdBy',
			filters: generateFilters(
				expenses as IExpenseDetails[],
				'createdBy',
				(createdBy) => createdBy.name
			),
			onFilter: (value, expense) => expense.createdBy.name === value,
			sorter: (a, b) => a.createdBy.name.localeCompare(b.createdBy.name),
		},
		{
			title: 'Original Time',
			dataIndex: 'originalTime',
			key: 'originalTime',
			render: (originalTime: string) => formatDateTimeDynamic(originalTime),
			sorter: (a, b) => getTimeStamp(a.originalTime) - getTimeStamp(b.originalTime),
		},
		{
			title: 'Entry Time',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (createdAt: string) => formatDateTimeDynamic(createdAt),
			sorter: (a, b) => getTimeStamp(a.createdAt) - getTimeStamp(b.createdAt),
		},
		{
			title: 'Last Updated',
			dataIndex: 'updatedAt',
			key: 'updatedAt',
			render: (updatedAt: string) => formatDateTimeDynamic(updatedAt),
			sorter: (a, b) => getTimeStamp(a.updatedAt) - getTimeStamp(b.updatedAt),
		},
		{
			title: 'Actions',
			dataIndex: '_id',
			key: '_id',
			render: (id: string) => {
				return (
					<Fragment key={id}>
						<Flex align="center" gap={4}>
							{/* Update Button */}
							<Tooltip title="Update Expense">
								<Button
									color="green"
									type="text"
									variant="text"
									icon={<Icon icon="bx:edit" width={24} />}
									onClick={() => {
										setSelectedExpenseId(id);
										setDrawerVisible(true);
									}}
								/>
							</Tooltip>

							{/* Delete Button */}
							<Tooltip title="Delete Expense">
								<Popconfirm
									onConfirm={() => handleDeleteExpense(id)}
									okText="Yes"
									cancelText="No"
									placement="topRight"
									title="Delete the Expense?"
									description="Are you sure to delete this expense?"
								>
									<Button
										danger
										type="text"
										icon={<Icon icon="mi:delete" width={24} />}
									/>
								</Popconfirm>
							</Tooltip>
						</Flex>

						{/* <CommonDrawer
							title="Add New Expense"
							visible={isDrawerVisible}
							onClose={() => {
								setDrawerVisible(false);
								setSelectedExpenseId('');
							}}
						>
							<UpdateExpense
								id={selectedExpenseId}
								setDrawerVisible={setDrawerVisible}
								setSelectedExpenseId={setSelectedExpenseId}
							/>
						</CommonDrawer> */}
					</Fragment>
				);
			},
		},
	];

	if (isLoading) {
		return (
			<Flex align="center" justify="center" gap="middle">
				<Spin spinning={isLoading} percent="auto" size="large" />
			</Flex>
		);
	}

	return (
		<Fragment>
			<AntdTable
				bordered
				data={expenses}
				columns={ExpensesColumn}
				excludedFields={['updatedAt', 'createdBy']}
				searchPlaceholder="Search Expense"
			/>
		</Fragment>
	);
};

export default ExpenseTable;
