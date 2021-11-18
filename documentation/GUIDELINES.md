# GUIDELINES

Some of conventions that hopefully makes codebase more consistent, and thus development easier

## Philosophy

- Develop for long-term velocity

## General

**Important!** [Follow this guide](https://github.com/labs42io/clean-code-typescript) on writing clean code

## Naming convention

- React Components and ES Modules should be named with with `PascalCase`
- Files that export single functions or single object should be named with that function/object name. e.g. `doSomething.js`, `someData.json`
- Folders should be lower cased separated by hyphens `-`

## TypeScript

- Prefer named exports. Helps with code autocompletion and some tools work only with named exports

  ```tsx
  // Prefer this
  export const Component = () => { ... }

  // Over this
  const Component = () => { ... }
  export default Component
  ```

## React Components

- Use function components
- A component should have maximum ~2 states or a single reducer

## Todos

Each `TODO`, `REVIEW`, `NOTE`, `FIXME` comment is highlighted so use them to inform the next developer. `TODO`s are also linked to GitHub and will automatically open issues, so if there are multiple `TODO`s pertaining to an umbrella issue, aggregate it as a single one.
