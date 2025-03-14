import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { colorSchemeManager, theme } from './theme';
import { BrowserRouter } from 'react-router';
import { AppRoutes } from './routes';

const App = () => {
	return (
		<MantineProvider
			theme={theme}
			defaultColorScheme="dark"
			colorSchemeManager={colorSchemeManager}
		>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</MantineProvider>
	);
};

export default App;
