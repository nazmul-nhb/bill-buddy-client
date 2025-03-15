import { Button, Flex, Popconfirm, Spin, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { capitalizeString } from 'nhb-toolbox';
import { Fragment, useState } from 'react';
import {
	useDeleteExpenseMutation,
	useGetAllExpensesQuery,
} from '../../../app/api/expenseApi';
import AntdImage from '../../../components/AntdImage';
import AntdTable from '../../../components/AntdTable';
import CommonDrawer from '../../../components/CommonDrawer';
import IconifyIcon from '../../../components/IconifyIcon';
import { useNotifyResponse } from '../../../hooks/useNotifyResponse';
import type { IExpenseDetails } from '../../../types/expense.types';
import { formatDateTimeDynamic, getTimeStamp } from '../../../utils/dates';
import { generateFilters, getImageLink } from '../../../utils/helpers';
import ExpenseForm from './ExpenseForm';

const ExpenseTable = () => {
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

	const ExpensesColumn: ColumnsType<IExpenseDetails & { index: number }> = [
		{
			title: 'SL',
			dataIndex: 'index',
			key: 'index',
			sorter: (a, b) => a.index - b.index,
			render: (index: number) => String(index).padStart(6, '0'),
		},
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
			title: 'Receipt',
			dataIndex: 'receipt',
			key: 'receipt',
			render: (_, expense) =>
				expense.receipt ? (
					<AntdImage
						width={80}
						src={getImageLink(expense.receipt)}
						alt={expense.items}
					/>
				) : (
					'N/A'
				),
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
			title: 'Expense Time',
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
			render: (id: string, expense) => {
				return (
					<Fragment key={id}>
						<Flex align="center" gap={4}>
							{/* Update Button */}
							<Button
								color="green"
								type="text"
								variant="text"
								icon={<IconifyIcon icon="bx:edit" width={24} />}
								onClick={() => {
									setSelectedExpenseId(id);
									setDrawerVisible(true);
								}}
							/>

							{/* Delete Button */}
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
									icon={<IconifyIcon icon="mi:delete" width={24} />}
								/>
							</Popconfirm>
						</Flex>
						{expenses && (
							<CommonDrawer
								key={expense._id}
								title="Add New Expense"
								visible={isDrawerVisible}
								onClose={() => {
									setSelectedExpenseId('');
									setDrawerVisible(false);
								}}
							>
								<ExpenseForm
									key={expense._id}
									id={selectedExpenseId}
									setDrawerVisible={setDrawerVisible}
									setSelectedExpenseId={setSelectedExpenseId}
								/>
							</CommonDrawer>
						)}
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
				data={expenses?.map((expense, idx) => ({ ...expense, index: idx + 1 }))}
				columns={ExpensesColumn}
				excludedFields={['updatedAt', 'createdAt', 'createdBy']}
				searchPlaceholder="Search Expense"
			/>
		</Fragment>
	);
};

export default ExpenseTable;
