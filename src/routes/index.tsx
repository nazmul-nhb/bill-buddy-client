import { Route, Routes } from 'react-router';
import Root from '../layouts/Root';
import Login from '../pages/Login';

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path="*" element={'<NotFound />'} />
			<Route path="/unauthorized" element={'<Unauthorized />'} />
			<Route path="/register" element={'<Register />'} />
			<Route path="/login" element={<Login />} />
			<Route path="/" element={<Root />}></Route>
		</Routes>
	);
};
