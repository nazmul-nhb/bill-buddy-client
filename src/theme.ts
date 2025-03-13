import { createTheme, localStorageColorSchemeManager } from '@mantine/core';
import { configs } from './configs/site_configs';

export const theme = createTheme({
	/* Put your mantine theme override here */
});

export const colorSchemeManager = localStorageColorSchemeManager({
	key: configs.theme_name,
});
