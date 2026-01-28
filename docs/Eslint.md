Overview

As part of this sprint, the project was enhanced with strict code quality and consistency rules using TypeScript, ESLint, Prettier, and Git pre-commit hooks.
The goal of this setup is to catch bugs early, maintain a consistent coding style, and ensure clean code across the team throughout the sprint.

This configuration enforces best practices automatically before code is committed, reducing runtime errors and review overhead.

1. Strict TypeScript Configuration

TypeScript strict mode was enabled to improve type safety and prevent common programming errors at compile time.

Configuration (tsconfig.json)
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}

Why Strict Mode?

strict: true
Enables all strict type-checking options for maximum safety.

noImplicitAny
Prevents variables or parameters from defaulting to any, forcing explicit and meaningful types.

noUnusedLocals & noUnusedParameters
Eliminates dead code and unused variables, keeping the codebase clean.

forceConsistentCasingInFileNames
Prevents file import issues across different operating systems.

skipLibCheck
Improves build performance by skipping type checks for external libraries.

✅ Result: Fewer runtime bugs, clearer contracts between components, and more maintainable code.

2. ESLint & Prettier Setup

ESLint and Prettier were configured together to enforce code correctness and consistent formatting.

Installed Dependencies
npm install eslint prettier eslint-config-next eslint-plugin-prettier eslint-config-prettier --save-dev

ESLint Configuration (.eslintrc.json)
{
  "extends": ["next/core-web-vitals", "plugin:prettier/recommended"],
  "rules": {
    "no-console": "warn",
    "semi": ["error", "always"],
    "quotes": ["error", "double"]
  }
}

ESLint Rules Explained

Next.js Core Web Vitals
Enforces performance and accessibility best practices.

Prettier Integration
Prevents conflicts between ESLint and Prettier formatting rules.

no-console: warn
Discourages unnecessary console logs in production code.

semi: always
Enforces consistent use of semicolons.

quotes: double
Standardizes string quotes across the codebase.

Prettier Configuration (.prettierrc)
{
  "singleQuote": false,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}

Why Prettier?

Ensures consistent formatting

Eliminates debates over style

Automatically formats code on save or commit

3. Pre-Commit Hooks (Husky + lint-staged)

To enforce code quality before code reaches the repository, pre-commit hooks were added.

Setup Commands
npx husky-init && npm install
npm install lint-staged --save-dev

lint-staged Configuration (package.json)
"lint-staged": {
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"]
}

How It Works

Runs only on staged files

Automatically:

Fixes lint issues

Formats code using Prettier

Blocks commits if errors remain unresolved

Example Behavior

❌ Commit fails if code violates lint rules

✅ Commit succeeds after issues are fixed automatically

This ensures that only clean and formatted code enters the repository.