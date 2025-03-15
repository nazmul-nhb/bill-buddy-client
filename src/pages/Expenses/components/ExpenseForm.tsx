import { Button, Col, DatePicker, Flex, Form, Row, Spin, type FormProps } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { capitalizeString, convertIntoFormData, extractUpdatedFields } from 'nhb-toolbox';
import React, { useEffect, type Dispatch, type SetStateAction } from 'react';
import {
	useCreateExpenseMutation,
	useGetSingleExpenseQuery,
	useUpdateExpenseMutation,
} from '../../../app/api/expenseApi';
import AntdFormInput from '../../../components/AntdFormInput';
import DraggableUpload from '../../../components/DraggableUpload';
import IconifyIcon from '../../../components/IconifyIcon';
import { EXPENSE_TYPES, PAYMENT_TYPES } from '../../../configs/constants';
import { useNotifyResponse } from '../../../hooks/useNotifyResponse';
import { type IExpenseData } from '../../../types/expense.types';
import { previewAntdImage } from '../../../utils/helpers';

interface ExpenseFormProps {
	id?: string;
	setDrawerVisible?: Dispatch<SetStateAction<boolean>>;
	setSelectedExpenseId?: Dispatch<SetStateAction<string>>;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
	id,
	setDrawerVisible,
	setSelectedExpenseId,
}) => {
	const [expenseForm] = Form.useForm<IExpenseData>();
	const { handleError, handleSuccess } = useNotifyResponse();

	const { data: expenseData, isLoading: isExpenseLoading } = useGetSingleExpenseQuery(
		id,
		{ skip: !id }
	);

	const [createExpense, { isLoading }] = useCreateExpenseMutation();
	const [updateExpense, { isLoading: isUpdateLoading }] = useUpdateExpenseMutation();

	useEffect(() => {
		if (expenseData?.data) {
			expenseForm.setFieldsValue({
				...expenseData.data,
				originalTime: expenseData.data.originalTime
					? dayjs(expenseData.data.originalTime)
					: undefined,

				receipt: expenseData.data.receipt
					? previewAntdImage(expenseData.data.receipt)
					: undefined,
			});
		}
	}, [expenseData?.data, expenseForm]);

	/** Handles form submission */
	const handleSubmit: FormProps<IExpenseData>['onFinish'] = async (data) => {
		if (expenseData?.data && id && setDrawerVisible && setSelectedExpenseId) {
			const { receipt, ...withoutReceipt } = data;

			withoutReceipt.originalTime = (data.originalTime as Dayjs).toISOString();

			const updated = extractUpdatedFields(expenseData.data, withoutReceipt);

			console.log(updated);

			if (receipt) {
				(updated as IExpenseData).receipt = receipt;
			}

			try {
				const preparedData = convertIntoFormData(updated);

				const upRes = await updateExpense({
					id,
					data: preparedData,
				}).unwrap();

				if (upRes.success) {
					handleSuccess(upRes);
					setDrawerVisible(false);
					setSelectedExpenseId('');
				}
			} catch (error) {
				handleError(error);
			}
		} else {
			try {
				if (!data.receipt) {
					delete data.receipt;
				}

				data.originalTime = (data.originalTime as Dayjs).toISOString();

				const formattedData = convertIntoFormData(data);

				const res = await createExpense(formattedData).unwrap();

				if (res.success) {
					handleSuccess(res);
				}
			} catch (error) {
				handleError(error);
			}
		}
	};

	if (isExpenseLoading) {
		return (
			<Flex align="center" justify="center" gap="middle">
				<Spin spinning={isExpenseLoading} percent="auto" size="large" />
			</Flex>
		);
	}
	return (
		<Form
			key={id}
			size="large"
			form={expenseForm}
			onFinish={handleSubmit}
			layout="vertical"
		>
			<Row gutter={16}>
				<AntdFormInput
					colProps={{ xs: 24 }}
					label="Items"
					name="items"
					type="text"
					prefix={<IconifyIcon icon="mdi:cart" width="20" height="20" />}
					rules={[{ required: true, message: 'Please enter item name' }]}
				/>
			</Row>

			<Row gutter={16}>
				<AntdFormInput
					colProps={{ xs: 24, md: 12 }}
					label="Expense Type"
					name="expenseType"
					type="select"
					options={EXPENSE_TYPES.map((type) => ({
						label: capitalizeString(type),
						value: type,
					}))}
					prefix={
						<IconifyIcon
							style={{ marginTop: 6 }}
							icon="arcticons:day-to-day-expenses"
							width="20"
							height="20"
						/>
					}
					rules={[{ required: true, message: 'Please select an expense type' }]}
				/>
				<AntdFormInput
					colProps={{ xs: 24, md: 12 }}
					label="Payment Type"
					name="paymentType"
					type="select"
					options={PAYMENT_TYPES.map((type) => ({
						label: capitalizeString(type),
						value: type,
					}))}
					prefix={
						<IconifyIcon
							style={{ marginTop: 6 }}
							icon="arcticons:expense-register"
							width="20"
							height="20"
						/>
					}
					rules={[{ required: true, message: 'Please select a payment type' }]}
				/>
			</Row>

			<Row gutter={16}>
				<AntdFormInput
					colProps={{ xs: 24, md: 12 }}
					label="Cost"
					name="cost"
					type="number"
					prefix={
						<IconifyIcon
							style={{ marginTop: 2 }}
							icon="tabler:coin-taka"
							width="20"
							height="20"
						/>
					}
					rules={[{ required: true, message: 'Please enter the cost' }]}
				/>
				<Col xs={24} md={12}>
					<Form.Item
						label="Date & Time"
						name="originalTime"
						rules={[
							{
								required: true,
								message: 'Please select a date and time',
							},
						]}
					>
						<DatePicker
							prefix={
								<IconifyIcon
									style={{ marginTop: 2 }}
									icon="fluent-mdl2:date-time"
									width="20"
									height="20"
								/>
							}
							showTime
							format="ddd MMM DD, YYYY HH:mm A"
							style={{ width: '100%' }}
							placeholder="Select Date & Time"
						/>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<DraggableUpload
					colProps={{ span: 24 }}
					label="Upload Receipt (Optional)"
					name="receipt"
					accept="image/*"
					listType="picture"
				/>
			</Row>

			<Row>
				<Col xs={24}>
					<Form.Item>
						<Button
							variant="solid"
							type="default"
							htmlType="submit"
							block
							loading={isLoading || isUpdateLoading}
							size="large"
							style={{ width: '100%' }}
							icon={
								<IconifyIcon
									icon="mdi:content-save-outline"
									width="24"
									height="24"
								/>
							}
						>
							{id ? 'Update Expense' : 'Submit Expense'}
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

export default ExpenseForm;
