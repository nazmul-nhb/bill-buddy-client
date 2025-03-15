import { Button, Card, Row } from 'antd';
import { useState } from 'react';
import AntdBreadcrumb from '../../components/AntdBreadcrumb';
import CommonDrawer from '../../components/CommonDrawer';
import IconifyIcon from '../../components/IconifyIcon';
import AddExpense from './components/AddExpense';
import ExpenseTable from './components/ExpenseTable';

const Expenses = () => {
	const [isDrawerVisible, setDrawerVisible] = useState(false);

	return (
		<section>
			<Card size="small">
				<Row align="middle" justify="space-between" gutter={[5, 16]}>
					<AntdBreadcrumb />
					<Button
						icon={<IconifyIcon icon="mdi:plus" />}
						type="primary"
						onClick={() => setDrawerVisible(true)}
					>
						New Expense
					</Button>
				</Row>
				<ExpenseTable />
			</Card>
			<CommonDrawer
				title="Create New Expense"
				visible={isDrawerVisible}
				onClose={() => setDrawerVisible(false)}
			>
				<AddExpense />
			</CommonDrawer>
		</section>
	);
};

export default Expenses;
