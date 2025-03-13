import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { colorSchemeManager, theme } from './theme';

const App = () => {
	return (
		<MantineProvider
			theme={theme}
			defaultColorScheme="dark"
			colorSchemeManager={colorSchemeManager}
		>
			Hello
		</MantineProvider>
	);
};

export default App;
