// eslint.config.js (Flat Config 방식)
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],

    plugins: {
      import: require("eslint-plugin-import"),
    },

    rules: {
      "import/no-unresolved": "error", // 이미 쓰고 있는 룰일 수 있음
    },

    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json", // tsconfig 경로 지정
        },
      },
    },
  },
]);
