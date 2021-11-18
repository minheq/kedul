# Development

Development happens under `packages/*`, logically separated by functionality and name:

## Web/Mobile App

Named `app-[APP_NAME]-{web,mobile,core}`

Package `app-[APP_NAME]-core` contains universal code shared by web and mobile packages, and so the screens and components of an app are developed here.

Packages `app-[APP_NAME]-web` and `app-[APP_NAME]-mobile` are the bridges for their respective platforms, and may contain extra platform-specific features

### Web App

At the root of the project, in the terminal run:

```bash
yarn start
```

The Web Application runs on `localhost:3000`

### Mobile App

To be able to run the app on mobile devices, follow the [instruction on React Native docs](https://facebook.github.io/react-native/docs/getting-started). Select `React Native CLI Quickstart` > `[Platform you are on]` > `[Platform you want to develop for]`

After you are all setup, go to `app-[APP_NAME]-mobile` directory and run either:

```bash
yarn develop:ios
yarn develop:android
```

## API Gateway

Named `app-[APP_NAME]-gateway`

API Gateway combines all web services to form an unified interface for the web/mobile app to communicate with, currently exposed as GraphQL server.

_Note: API Gateway just serves as a glue for web services. [See Web Service](#web-service)_

At the root of the project, in the terminal run:

```bash
# Same command as for Web App Workflow.
yarn start
```

The API Gateway runs on `localhost:4000`

### Debugging

In VSCode debugger, select `Attach to Web App` for debugging web app or `Attach to API Gateway` for debugging gateway. For both, select `Attach to both API Gateway and Web App`. You can set breakpoints now

## Web Service

Named `service-*`

Core server logic of the application is developed within services. The single source of truth of a service is its `schema.graphql`. It contains the interface of the service and entities structure, by running the command

```bash
yarn generate
```

We use its DSL to generate 4 files

`/generated/Shared.ts`

- Entity Types
- Event Types
- Errors Types and Messages
- Mutation and Query Signatures
- API interface

`/generated/Database.ts`

- Database Object Types
- Migration Functions

`/generated/Metadata.ts` - Metadata of the service

`/generated/TypeDefs.ts` - Transformed schema into a string for export and usage in Gateway

Once we have are generated data we can proceed with main business logic in

- `/mutations/*` - Modules with logic for mutating data
- `/queries/*` - Modules with logic for querying data
- `/repositories/*` Modules that deal interact with databases and external data

Development happens against unit tests as they provide instantaneous feedback to our changes. Tests are co-located to the modules, and have `*.test.ts` suffix.

In VSCode debugger, select `Test Current File` to test the module of interest.

## Workflows

### Creating a form to call a mutation to the gateway

- In `app-salon-gateway/documents/Mutations.graphql` write the mutation you want the client to send to the backend (You can use the GraphQL playground at `localhost:4000` to write one with autocompletion) e.g.

  ```graphql
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      client {
        ...Client
      }
      isSuccessful
      userError {
        ...UserError
      }
    }
  }
  ```

- Then, in `app-salon-gateway` run command

  ```bash
  yarn generate
  ```

  This command will generate code (in `MutationsAndQueries.tsx`) that you can use directly in the client app. Following the example above, it will create `useCreateClientForm` function

- On the client, you can use it as such:

  ```tsx
  import { useCreateClientForm } from "@kedul/app-salon-gateway"

  const Screen = () => {
    const form = useCreateClientForm({
      initialValues: {
        notes: ""
        ...
      },
      onCompleted: () => ...
    })
  }
  ```

- You can now create a UI for the form with following props:

  ```tsx
  export interface CreateClientFormProps {
    form: FormikProps<CreateClientInput>;
  }
  ```

  and then connect the UI to the generated form

  ```tsx
  <CreateClientForm form={form} />
  ```

## Troubleshooting

[Refer to TROUBLESHOOTING docs](/docs/TROUBLESHOOTING.md)
