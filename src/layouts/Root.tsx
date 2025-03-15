import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router';
import { configs } from '../configs/site_configs';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useTheme } from '../hooks/useTheme';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const { Content, Footer } = Layout;

const Root: React.FC = () => {
	const { isDarkTheme } = useTheme();
	const isMobile = useMediaQuery(960);

	return (
		<Layout style={{ height: '100vh', maxWidth: '100%', overflow: 'hidden' }}>
			{isMobile || <Sidebar isDarkTheme={isDarkTheme} />}
			<Layout style={{ maxWidth: '100%' }}>
				<Navbar isDarkTheme={isDarkTheme} />
				<div style={{ overflow: 'auto', height: '100vh' }}>
					<Content style={{ minHeight: '100vh', padding: '8px 12px' }}>
						<Outlet />
					</Content>
					<Footer style={{ textAlign: 'center' }}>
						&copy; {new Date().getFullYear()} {configs.site_title}
					</Footer>
				</div>
			</Layout>
		</Layout>
	);
};

export default Root;
