import  globals from 'globals';
import  haensl from '@haensl/eslint-config';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    }
  },
  ...haensl
];
