//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default [
  { ignores: ['.nitro/**', '.output/**', '*.config.js'] },
  ...tanstackConfig,
  jsxA11y.flatConfigs.recommended,
]
