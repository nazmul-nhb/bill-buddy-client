import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import Title from 'antd/es/typography/Title';
import React from 'react';
import { routes } from '../../configs/route_list';
import { configs } from '../../configs/site_configs';
import { useGetSelectedPath } from '../../hooks/useSelectedPath';
import { formatRoutes } from '../../utils/routeUtils';
// import { useAuth } from '../../hooks/useAuth';

interface Props {
	isDarkTheme: boolean;
}

const Sidebar: React.FC<Props> = ({ isDarkTheme }) => {
	// const { user } = useAuth();

	const { selectedPath, selectCurrentPath } = useGetSelectedPath();

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
				style={{
					textAlign: 'center',
					paddingTop: 16,
					textWrap: 'nowrap',
				}}
				level={3}
				title={configs.site_title}
			>
				{configs.site_title}
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
