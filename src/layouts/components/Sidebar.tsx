import { Menu, Tooltip } from 'antd';
import Sider from 'antd/es/layout/Sider';
import Title from 'antd/es/typography/Title';
import React from 'react';
import { routes } from '../../configs/route_list';
import { useAuth } from '../../hooks/useAuth';
import { useGetSelectedPath } from '../../hooks/useSelectedPath';
import { formatRoutes } from '../../utils/routeUtils';

interface Props {
	isDarkTheme: boolean;
}

const Sidebar: React.FC<Props> = ({ isDarkTheme }) => {
	const { user } = useAuth();

	const { selectedPath, selectCurrentPath } = useGetSelectedPath();

	if (!user) {
		return;
	}

	return (
		<Sider
			width={240}
			style={{
				height: '100vh',
				overflow: 'hidden',
				backgroundColor: isDarkTheme ? '#141414' : '#727272',
			}}
			trigger={false}
		>
			<Title
				ellipsis
				style={{
					textAlign: 'left',
					padding: '16px 0 0 8px',
					textWrap: 'nowrap',
				}}
				level={5}
			>
				<Tooltip arrow={{ pointAtCenter: false }} title={user.name}>
					Welcome {user.name}
				</Tooltip>
			</Title>
			{/* Make the menu scrollable independently */}
			<div
				style={{
					flex: 1,
					overflowY: 'auto',
					height: 'calc(100vh - 100px)', // Adjust based on content
				}}
			>
				<Menu
					style={{
						backgroundColor: isDarkTheme ? '#141414' : '#727272',
					}}
					theme={isDarkTheme ? 'dark' : 'light'}
					mode="inline"
					onClick={selectCurrentPath}
					defaultSelectedKeys={[selectedPath]}
					items={formatRoutes(routes, 'menu')}
				/>
			</div>
		</Sider>
	);
};

export default Sidebar;
