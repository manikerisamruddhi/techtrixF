import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer'; // Ensure correct import

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html', // The location to save the visualization file
      open: true, // Automatically open the file in the default browser after build
      gzipSize: true, // Include gzip size in the report
      brotliSize: true, // Include brotli size in the report
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Set alias for easy imports
    },
  },
  server: {
    port: 3000,
    open: true,
    historyApiFallback: true, // Add this line to handle routing issues
  },
  build: {
    outDir: 'dist',
  },
});
