import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Global ignores
  {
    ignores: [
      "src/generated/**/*",
      "generated/**/*",
      "**/*.generated.*"
    ]
  },
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // your custom rules
      'react-hooks/exhaustive-deps': 'off',
    }
  }
];

export default eslintConfig;