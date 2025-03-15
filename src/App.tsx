import { App, ConfigProvider } from 'antd';
import { useRef } from 'react';
import { BrowserRouter } from 'react-router';
import { useTheme } from './hooks/useTheme';
import { processNotifications } from './lib/notifications';
import { AppRoutes } from './routes';
import type { TNotifications } from './types';
import '@ant-design/v5-patch-for-react-19';

/**
 * Use modified `antd` notification methods as `toast`, `notify` and `showModal`.
 * @param sound - Whether to play sound effects or not.
 * @returns The notification methods (`toast`, `notify`, `showModal`).
 */
export function AntNotifications(sound?: boolean): TNotifications {
	const appProps = App.useApp();

	const { toastify, notify, modal } = processNotifications(appProps, sound);

	return { toastify, notify, modal };
}

const RootApp = () => {
	const { algorithm } = useTheme();

	const modalContainerRef = useRef<HTMLDivElement>(null);

	return (
		<ConfigProvider
			getPopupContainer={() => modalContainerRef.current as HTMLElement}
			theme={{ algorithm }}
		>
			<App
				notification={{
					pauseOnHover: true,
					showProgress: true,
					placement: 'bottomRight',
				}}
				message={{ duration: 2 }}
			>
				<div ref={modalContainerRef}>
					<BrowserRouter>
						<AppRoutes />
					</BrowserRouter>
				</div>
			</App>
		</ConfigProvider>
	);
};

export default RootApp;
