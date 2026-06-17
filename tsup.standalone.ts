import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/standalone.tsx'],
	format: ['iife'],
	globalName: 'DeviceViewStandalone',
	outDir: 'dist',
	sourcemap: false,
	clean: false,
	noExternal: ['react', 'react-dom'],
	platform: 'browser',
	minify: true,
	esbuildOptions(options) {
		options.jsx = 'automatic';
	},
});
