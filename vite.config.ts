import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Defines process.env for the browser environment so the Google GenAI SDK works
    'process.env': process.env
  }
});