import './styles.css';

import { TitleProvider } from 'nhb-hooks';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import { configs } from './configs/site_configs';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<TitleProvider config={{ siteTitle: configs.site_title }}>
				<App />
			</TitleProvider>
		</Provider>
	</StrictMode>
);
