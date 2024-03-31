import { Plugin, defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';

function mockAnki(): Plugin {
  return {
    name: 'html-inject', // Required, will show up in warnings and errors
    apply: 'serve', // Apply this plugin only in development mode
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace('{{Sentence}}', 'How can I?');
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [mockAnki(), svelte(), viteSingleFile()],
  resolve: {
    alias: {
      src: '/src',
    },
  }
});
