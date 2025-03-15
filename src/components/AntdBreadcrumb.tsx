import { Breadcrumb } from 'antd';
import { convertStringCase } from 'nhb-toolbox';
import { Link, useLocation } from 'react-router';
import IconifyIcon from './IconifyIcon';

const AntdBreadcrumb = () => {
	const location = useLocation();
	const pathnames = location.pathname.split('/').filter(Boolean);

	const breadcrumbs = [
		{
			title: (
				<Link to="/">
					<IconifyIcon icon="line-md:home-twotone" width="20" height="20" />
				</Link>
			),
		},
		...pathnames.map((title, index) => {
			const path = `/${pathnames.slice(0, index + 1).join('/')}`;
			const isLast = index === pathnames.length - 1;

			if (!isLast) {
				return {
					key: title,
					title: (
						<Link to={path}>
							{convertStringCase(title.replace(/-/g, ' '), 'Title Case')}
						</Link>
					),
				};
			}
			return {
				key: title,
				title: convertStringCase(title.replace(/-/g, ' '), 'Title Case'),
			};
		}),
	];

	return (
		<Breadcrumb
			items={breadcrumbs}
			separator={
				<IconifyIcon
					icon="fluent:ios-arrow-right-24-filled"
					width="12"
					height="12"
				/>
			}
		/>
	);
};

export default AntdBreadcrumb;
