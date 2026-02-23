import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
  plugins: [tailwindcss(), enhancedImages(), sveltekit(), devtoolsJson()]
});

export default config;
