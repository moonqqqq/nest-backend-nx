export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'hotfix',
        'cicd',
        'chore',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'add',
        'init',
        'test',
        'temp',
        'cicd',
      ],
    ],
    'subject-case': [0],
  },
};
