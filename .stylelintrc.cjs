module.exports = {
  extends: ['stylelint-config-standard-scss'],
  customSyntax: 'postcss-scss',
  rules: {
    // 允许 Element Plus 的 BEM 命名（el-xxx__xxx）
    'selector-class-pattern': null,
    // SCSS 特定规则
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['use', 'mixin', 'include', 'if', 'else', 'each', 'for', 'function', 'return']
      }
    ],
    // 允许 CSS 变量插值
    'function-no-unknown': null,
    'media-query-no-invalid': null,
    // 允许嵌套规则
    'no-descending-specificity': null
  }
}


