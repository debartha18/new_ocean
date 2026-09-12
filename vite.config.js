import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'local-api-translate',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/translate' && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  translatedText: parsed.text || '',
                  fallback: true,
                  devNotice: 'Vite local dev translation mock'
                }));
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
            return;
          }
          next();
        });
      }
    }
  ],
});
