import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  // Generated files: committed build output and base64-embedded skin/boot assets.
  {
    ignores: ['dist', 'example/dist', 'src/skins/iosNinePatch.ts', 'src/skins/androidNinePatch.ts', 'src/skins/pixel9.ts', 'src/skins/bootAssets.ts'],
  },
  ...tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  {
    rules: {
      // Pre-existing casts in stream plumbing; tighten to 'error' once cleaned up.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Pre-existing deliberate patterns (screenSizeRef read in render, setState
      // inside stream effects) — surface as warnings, don't fail CI on them.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
);
