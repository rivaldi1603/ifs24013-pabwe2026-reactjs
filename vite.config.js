import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: Number(env.APP_PORT) || 5173,
    },
    define: {
      DELCOM_BASEURL: JSON.stringify(
        env.DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1'
      ),
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/main.jsx',
          'src/setupTests.js',
          'src/test-utils.jsx',
          'vite.config.js',
        ],
      },
    },
  };
});