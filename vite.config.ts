import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// * https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: { chunkSizeWarningLimit: 3036 },
	server: { host: true },
});
