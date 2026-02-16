import { type Config } from "prettier";

const config: Config = {
  bracketSameLine: true,
  printWidth: 100,
  trailingComma: "none",
  plugins: [
    "prettier-plugin-svelte",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ],
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
  importOrder: [
    "<BUILTIN_MODULES>",
    "<THIRD_PARTY_MODULES>",
    "^@",
    "^\\$(?!lib/)",
    "^\\$lib/",
    "^[.]"
  ],
  tailwindStylesheet: "./src/routes/layout.css"
};

export default config;
