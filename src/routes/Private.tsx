import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import type { ISingleUser } from '../types/user.types';

interface Props {
	roles: ISingleUser['role'][];
	children: React.ReactNode;
}

const Private: React.FC<Props> = ({ roles, children }) => {
	const location = useLocation();

	const { token, user, isLoading } = useAuth();

	if (isLoading) {
		return 'Loading...';
	}

	if (!user || !token) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (!roles.includes(user.role)) {
		return <Navigate to="/unauthorized" />;
	}
	return children;
};

export default Private;
