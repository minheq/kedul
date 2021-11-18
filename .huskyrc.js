module.exports = {
  hooks: {
    'pre-commit': 'yarn build && lint-staged',
    'post-merge': 'yarnhook',
    'post-rebase': 'yarnhook',
    'post-checkout': 'yarnhook',
  },
};
