import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/ads': 'http://localhost:3000',
            '/categories': 'http://localhost:3000',
            '/users': 'http://localhost:3000',
            '/favorites': 'http://localhost:3000',
        },
        allowedHosts: [
            "guild-consoles-marks-south.trycloudflare.com"
        ]
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    }
});
