import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    // root: './',
    // base: '/api',
    // publicDir: 'src',

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: '127.0.0.1',
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:8002',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
            },
        },
    },
    plugins: [react()],
});
