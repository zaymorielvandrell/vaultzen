import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
  plugins: [tailwindcss(), sveltekit(), devtoolsJson()]
});

export default config;
