import { Avatar, Button, Flex, Menu, Popover, Space, Spin } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AntNotifications } from '../../App';
import { logOut } from '../../app/features/authSlice';
import { useAppDispatch } from '../../app/hooks';
import IconifyIcon from '../../components/IconifyIcon';
import { configs } from '../../configs/site_configs';
import { useAuth } from '../../hooks/useAuth';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { getImageLink } from '../../utils/helpers';
import ResponsiveSidebar from './ResponsiveSidebar';

interface Props {
	isDarkTheme: boolean;
}

const Navbar: React.FC<Props> = ({ isDarkTheme }) => {
	const [open, setOpen] = useState<boolean>(false);
	const { user, isLoading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const isMobile = useMediaQuery(960);
	const dispatch = useAppDispatch();
	const { modal } = AntNotifications(true);

	// Store the current path in state for redirect after login
	const redirectState = { from: { pathname: location.pathname } };

	const handleLogOut = () => {
		modal.confirm({
			title: 'Log out Now?',
			content: 'Do you really want to log out?',
			onOk: () => {
				dispatch(logOut());
				navigate('/login', { state: redirectState });
			},
			okText: 'Log out',
			okType: 'primary',
			closable: true,
			type: 'confirm',
			maskClosable: true,
		});
	};

	return (
		<Header
			style={{
				padding: isMobile ? '0 8px' : '0 24px',
				backgroundColor: isDarkTheme ? '#141414' : '#727272',
			}}
		>
			<Flex
				align="center"
				justify={isMobile ? 'space-between' : 'flex-start'}
				gap={12}
				style={{ paddingTop: 8 }}
			>
				<Flex style={{}} align="center">
					{isMobile ? (
						<Button
							onClick={() => setOpen(true)}
							type="text"
							size="large"
							icon={
								<IconifyIcon icon="gg:menu-round" width="40" height="40" />
							}
						/>
					) : (
						<IconifyIcon icon="arcticons:budgetmylife" width="40" height="40" />
					)}
					<ResponsiveSidebar
						isDarkTheme={isDarkTheme}
						user={user}
						open={open}
						setOpen={setOpen}
					/>
					{/* Site Title */}
					<Link to="/">
						<Title
							style={{
								textAlign: 'center',
								paddingTop: 8,
								marginLeft: isMobile ? 8 : 16,
								textWrap: 'nowrap',
							}}
							level={4}
							title={configs.site_title}
						>
							{configs.site_title}
						</Title>
					</Link>
				</Flex>
				<Flex
					justify={isMobile ? 'flex-end' : 'space-between'}
					align="center"
					style={{ width: '100%' }}
				>
					{!isMobile ? (
						<Menu
							style={{
								backgroundColor: isDarkTheme ? '#141414' : '#727272',
								borderBottom: 0,
							}}
							theme={isDarkTheme ? 'dark' : 'light'}
							mode="horizontal"
							disabledOverflow
							overflowedIndicator={<IconifyIcon icon="mdi:menu" />}
							// openKeys={[selectedPath]}
						/>
					) : null}

					<Flex gap={8} align="center">
						{/* {algorithm === theme.defaultAlgorithm ? (
							<Button
								onClick={() => dispatch(setTheme('dark'))}
								icon={
									<IconifyIcon
										icon="mdi:moon-and-stars"
										width="24"
										height="24"
									/>
								}
								style={{ borderWidth: 0 }}
								type="default"
								shape="circle"
							/>
						) : (
							<Button
								onClick={() => dispatch(setTheme('light'))}
								icon={
									<IconifyIcon
										icon="ant-design:sun-outlined"
										width="24"
										height="24"
									/>
								}
								style={{ borderWidth: 0 }}
								type="default"
								shape="circle"
							/>
						)} */}
						{isLoading ? (
							<Spin />
						) : user ? (
							<Popover
								trigger="click"
								placement="bottomRight"
								content={
									<Space direction="vertical">
										<Button
											type="primary"
											icon={
												<IconifyIcon
													icon="raphael:user"
													width="24"
													height="24"
												/>
											}
											onClick={() => navigate('/profile')}
											style={{
												font: '18px bold',
											}}
										>
											Profile
										</Button>
										<Button
											type="primary"
											color="red"
											danger
											icon={
												<IconifyIcon
													icon="mdi:logout"
													width="24"
													height="24"
												/>
											}
											onClick={handleLogOut}
											style={{
												font: '18px bold',
											}}
										>
											Logout
										</Button>
									</Space>
								}
							>
								<Button
									type="link"
									size="large"
									shape="circle"
									icon={
										<Avatar
											alt={user.name}
											src={getImageLink(user.image)}
										/>
									}
								/>
							</Popover>
						) : (
							<Link to="login">
								<Button
									type="primary"
									title="Login"
									color="green"
									shape="default"
									icon={
										<IconifyIcon
											icon="mdi:lock"
											width="18"
											height="18"
										/>
									}
									style={{ font: '18px bold' }}
								>
									{isMobile || 'Login'}
								</Button>
							</Link>
						)}
					</Flex>
				</Flex>
			</Flex>
		</Header>
	);
};

export default Navbar;
