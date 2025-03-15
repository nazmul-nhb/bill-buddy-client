import Expenses from '../pages/Expenses';
import type { IRoute } from '../types/routes.types';

export const routes: IRoute[] = [
	{
		label: 'Manage Expenses',
		path: '/expenses',
		icon: 'arcticons:day-to-day-expenses',
		element: <Expenses />,
	},
];
