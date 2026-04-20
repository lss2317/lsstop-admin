// @ts-nocheck
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const autoImportConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.auto-import.json'), 'utf-8')
)

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/node_modules/**', '**/public/**', '**/.vscode/**', '**/src/assets/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,

  {
    languageOptions: {
      globals: {
        ...autoImportConfig.globals,
        Api: 'readonly',
      },
    },
  },

  {
    rules: {
      'no-var': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/multi-word-component-names': 'off',
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      'no-unexpected-multiline': 'error',
    },
  },
)
