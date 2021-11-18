# TROUBLESHOOTING

## Build

- **error TS5055: Cannot write file ... because it would overwrite input file.**  
  This error is caused by circular imports. Make sure to import from the right paths, i.e. no cyclic imports, imports from `/dist` and import from files (`/FileName` instead of `./index.ts` or `.`)

## Dependencies

If there are errors occurring related to dependencies, at the root of the project run

```bash
yarn reset
```

This will delete all `node_modules` and reinstall them and rebuilt internal dependencies

## Database

If there is some corrupted or outdated data in the database, at the root of the project run

```bash
yarn db:reset
```

This will drop and recreate the database, then run migrations and seeds
