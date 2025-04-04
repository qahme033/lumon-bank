# Banking Sim Monorepo

This monorepo contains all the packages for the Banking Sim project, which simulates a complete banking system. The project is managed using [Lerna](https://lerna.js.org/) to handle inter-package dependencies and versioning.

## Overview

The repository includes the following packages:

- **admin-api**: API for bank teller operations using classic user/password authentication.
- **psd2-api**: API for PSD2-compliant operations that include token authentication and customer consent verification.
- **auth-service**: Authentication utilities (e.g., token verification, role & scope checks).
- **common**: Shared types, enums, and API clients (accounts, customers, consents, transactions, etc.).
- **core-banking**: Core banking functionality.
- **scripts**: Utility scripts for setting up demos, starting services, and testing.

## Repository Structure

```plaintext
├── lerna.json
├── package-lock.json
├── package.json
├── packages
│   ├── admin-api
│   │   ├── dist
│   │   ├── dist2
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── src
│   │   ├── tsconfig.json
│   │   └── tsconfig.tsbuildinfo
│   ├── auth-service
│   │   ├── dist
│   │   ├── package.json
│   │   ├── src
│   │   ├── tsconfig.json
│   │   └── tsconfig.tsbuildinfo
│   ├── common
│   │   ├── dist
│   │   ├── package.json
│   │   ├── src
│   │   ├── tsconfig.json
│   │   └── tsconfig.tsbuildinfo
│   ├── core-banking
│   │   ├── dist
│   │   ├── dist_old
│   │   ├── package.json
│   │   ├── src
│   │   ├── tsconfig.json
│   │   └── tsconfig.tsbuildinfo
│   └── psd2-api
│       ├── dist
│       ├── package.json
│       ├── src
│       ├── tsconfig.json
│       └── tsconfig.tsbuildinfo
├── scripts
│   ├── setup-demo.ts
│   ├── start-all.ts
│   ├── start-bank.ts
│   ├── start-tpp.ts
│   ├── test-bank.ts
│   └── test-setup.ts
└── tsconfig.json
```

## Installation

Install Dependencies:  
Since this is a Lerna monorepo, run:

```
npm install
npm run build
```

## Running the Project

Start All Services:

```
npm run start-all
```

Start Specific Services:  

Admin API:

```
npm run start-bank
```

PSD2 API:

```
npm run start-tpp
```

## Development & Contributing

- The **common** package provides shared interfaces, enums, and API clients used across other services.
- The **auth-service** package implements token verification, role checks, and scope validations.
- PSD2 endpoints are secured with both authentication and customer consent verification.

Feel free to fork the repository, create feature branches, and open pull requests.
