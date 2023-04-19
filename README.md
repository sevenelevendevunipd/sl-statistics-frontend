# SmartLog Statistics Frontend

Frontend is based on [React](https://github.com/facebook/react), [PrimeReact](https://primereact.org/) and [TypeScript](https://www.typescriptlang.org/).
TypeScript definitions for backend API calls are generated from the respective OpenAPI specification.

## Requisites

- [NodeJS](https://nodejs.org/): tested on v19.5.
- [Yarn](https://yarnpkg.com/getting-started/install): tested on 3.4.1.

## Running

```sh
yarn install  # needed only on first run and on lockfile changes
yarn build    # build an optimized production build
yarn prodrun  # build & serve an optimized build
yarn start    # dev build & serve using dev server with hot reload
yarn apigen   # needed only on openapi spec changes
```

Server binds by default at `0.0.0.0:3000`, so no IPv6.
