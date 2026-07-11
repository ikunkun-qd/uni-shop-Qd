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
  // main.js 同时保留 Vue 2/Vue 3 两套条件编译入口，静态解析会误判重复声明。
  ignorePatterns: ['main.js'],
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
