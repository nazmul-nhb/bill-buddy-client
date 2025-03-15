import { Route, Routes } from 'react-router';
import { USER_ROLES } from '../configs/constants';
import { routes } from '../configs/route_list';
import Root from '../layouts/Root';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Register from '../pages/Register';
import Unauthorized from '../pages/Unauthorized';
import { formatRoutes } from '../utils/routeUtils';
import Private from './Private';

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path="*" element={<NotFound />} />
			<Route path="/unauthorized" element={<Unauthorized />} />
			<Route path="/register" element={<Register />} />
			<Route path="/login" element={<Login />} />
			<Route
				path="/"
				element={
					<Private roles={Object.values(USER_ROLES)}>
						<Root />
					</Private>
				}
			>
				{formatRoutes(routes, 'route')}
			</Route>
		</Routes>
	);
};
