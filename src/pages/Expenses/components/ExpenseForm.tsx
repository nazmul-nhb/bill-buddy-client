import { Button, Col, DatePicker, Flex, Form, Row, Spin } from 'antd';
import dayjs from 'dayjs';
import {
	capitalizeString,
	convertIntoFormData,
	createControlledFormData,
	extractUpdatedFields,
} from 'nhb-toolbox';
import React, { useEffect, useMemo, type Dispatch, type SetStateAction } from 'react';
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

	const previousData: IExpenseData = useMemo(
		() => ({
			items: expenseData?.data?.items ?? '',
			cost: expenseData?.data?.cost ?? 0,
			originalTime: dayjs(expenseData?.data?.originalTime ?? ''),
			expenseType: expenseData?.data?.expenseType ?? 'accessories',
			paymentType: expenseData?.data?.paymentType ?? 'cash',
			receipt: expenseData?.data?.receipt
				? previewAntdImage(expenseData?.data?.receipt)
				: undefined,
		}),
		[expenseData?.data]
	);

	useEffect(() => {
		if (expenseData?.data) {
			expenseForm.setFieldsValue(previousData);
		}
	}, [expenseData?.data, expenseForm, previousData]);

	/** Handles form submission */
	const handleSubmit = async (data: IExpenseData) => {
		data.originalTime = dayjs(data.originalTime).toISOString();

		if (id && expenseData?.data && setDrawerVisible && setSelectedExpenseId) {
			previousData.originalTime = dayjs(previousData.originalTime).toISOString();

			try {
				const updated = extractUpdatedFields(previousData, data);

				const updatedData = createControlledFormData(updated);

				const upRes = await updateExpense({
					id,
					data: updatedData,
				}).unwrap();

				if (upRes.success) {
					handleSuccess(upRes);
					expenseForm.resetFields();
					setDrawerVisible(false);
					setSelectedExpenseId('');
				}
			} catch (error) {
				handleError(error);
			} finally {
				// expenseForm.resetFields();
			}
		} else {
			try {
				const formattedData = convertIntoFormData(data);

				const res = await createExpense(formattedData).unwrap();

				if (res.success) {
					handleSuccess(res);
					expenseForm.resetFields();
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
