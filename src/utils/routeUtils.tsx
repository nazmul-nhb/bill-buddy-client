import { Icon } from '@iconify/react';
import type { ItemType, MenuItemType } from 'antd/es/menu/interface';
import type { ReactNode } from 'react';
import { NavLink, Route } from 'react-router';
import type { IRoute } from '../types/routes.types';

/**
 * * Function to format routes for Ant-Design `menuItems`.
 * @param routes Routes to format.
 * @param output Expected output: `menu`.
 * @param parentPath Optional parent path for internal use.
 */
export function formatRoutes(
	routes: IRoute[],
	output: 'menu' | 'nav-menu',
	parentPath?: string
): ItemType<MenuItemType>[];

/**
 * * Function to format routes for React Router `routes`.
 * @param routes Routes to format.
 * @param output Expected output: `routes`.
 * @param parentPath Optional parent path for internal use.
 */
export function formatRoutes(
	routes: IRoute[],
	output: 'route',
	parentPath?: string
): ReactNode[];

/**
 * * Function to format routes for React Router `routes` or Ant-Design `menuItems`.
 * @param routes Routes to format.
 * @param output Expected output: `routes` or `menu`.
 * @param parentPath Optional parent path for internal use.
 */
export function formatRoutes(
	routes: IRoute[],
	output: 'route' | 'menu' | 'nav-menu',
	parentPath: string = ''
): ItemType<MenuItemType>[] | ReactNode[] {
	const getFullPath = (path: string) => `${parentPath}/${path}`.replace(/\/+/g, '/');

	const hasChildren = (route: IRoute) =>
		route.children ? route.children.length > 0 : false;

	switch (output) {
		case 'menu':
		case 'nav-menu':
			return routes.map((route) => {
				const fullPath = getFullPath(route.path);

				// Handle index route
				if (route.path === '') {
					return {
						key: parentPath + parentPath,
						...(output === 'menu' && {
							icon: route.icon ? (
								<Icon icon={route.icon} width="24" height="24" />
							) : undefined,
						}),
						label: route.element ? (
							<NavLink to={parentPath}>{route.label}</NavLink>
						) : (
							route.label
						),
						children: hasChildren(route)
							? formatRoutes(route.children!, output, parentPath)
							: undefined,
					};
				}

				// For non-index routes
				return {
					key: fullPath + parentPath,
					...(output === 'menu' && {
						icon: route.icon ? (
							<Icon icon={route.icon} width="24" height="24" />
						) : undefined,
					}),
					label: route.element ? (
						<NavLink to={fullPath}>{route.label}</NavLink>
					) : (
						route.label
					),
					children: hasChildren(route)
						? formatRoutes(route.children!, output, fullPath)
						: undefined,
				};
			});
		case 'route':
			return routes.map((route) => {
				const fullPath = getFullPath(route.path);

				// Handle index route
				if (route.path === '') {
					return (
						<Route
							key={fullPath}
							path={parentPath} // Parent path for index route
							element={route.element}
						>
							{hasChildren(route) &&
								formatRoutes(route.children!, 'route', parentPath)}
						</Route>
					);
				}

				return (
					<Route key={fullPath} path={fullPath} element={route.element}>
						{hasChildren(route) &&
							formatRoutes(route.children!, 'route', fullPath)}
					</Route>
				);
			});
		default:
			return [];
	}
}
