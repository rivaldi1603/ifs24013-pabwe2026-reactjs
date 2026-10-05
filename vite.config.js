import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const deferCssPlugin = () => {
  return {
    name: 'defer-css',
    transformIndexHtml(html) {
      return html.replace(
        /<link([^>]*?)rel="stylesheet"([^>]*?)href="([^"]*?\.css)"([^>]*?)>/g,
        (match, p1, p2, p3, p4) => {
          return `<link rel="preload" as="style" href="${p3}">
    <link rel="stylesheet" href="${p3}" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="${p3}"></noscript>`;
        }
      );
    }
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), deferCssPlugin()],
    server: {
      port: Number(env.APP_PORT) || 5173,
    },
    define: {
      DELCOM_BASEURL: JSON.stringify(
        env.DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1'
      ),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-router-dom') || id.includes('@remix-run')) {
                return 'vendor-router';
              }
              if (id.includes('react-redux') || id.includes('@reduxjs')) {
                return 'vendor-redux';
              }
              if (id.includes('react-dom')) {
                return 'vendor-react-dom';
              }
              if (id.includes('react')) {
                return 'vendor-react-core';
              }
              if (id.includes('@tabler/icons-react')) {
                return 'vendor-icons';
              }
              return 'vendor';
            }
          }
        }
      }
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