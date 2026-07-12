module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  // uni-app 的模板格式交给 Prettier，ESLint 主要负责发现逻辑错误。
  extends: ['plugin:vue/essential'],
  // uni-app 负责处理 main.js 的运行时入口，源码本身仍参与其余规则校验。
  globals: {
    uni: 'readonly',
    plus: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly',
    wx: 'readonly',
    my: 'readonly',
    tt: 'readonly',
    App: 'readonly',
    Page: 'readonly',
    Component: 'readonly'
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    // 这两条在现有 uni-app 代码中先提示，不阻断 lint；后续改动时可逐步修复。
    'vue/no-use-v-if-with-v-for': 'warn',
    'vue/require-valid-default-prop': 'warn'
  }
}
