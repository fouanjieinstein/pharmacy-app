import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // This app hydrates client-only state (cart, wishlist, currency,
      // country, orders, prescriptions) from localStorage on mount inside
      // useEffect — that data isn't available during server render, so
      // there's no way to set it during render itself. That's the intended
      // use of this pattern, but the rule flags it as an error regardless;
      // downgraded to a warning rather than disabled outright.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
