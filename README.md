<div align="center" style="padding-bottom: 20px;">
  <img src="./.repo/images/cap-logo.svg" width="120" height="auto"/>
</div>

# Cap Explorer
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-blue.svg)](https://conventionalcommits.org)

Cap Explorer is the client interface for [Cap](https://github.com/Psychedelic/cap), an open internet service to store transaction history for NFTs/Tokens.

Learn more about [Cap](https://github.com/Psychedelic/cap) by reading the original spec [here](https://github.com/Psychedelic/cap/blob/main/spec.md).

## Table of Contents 

- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Dashboard development](#dashboard-development)
  - [The CAP Service](#the-cap-service)
    - [Version control](#cap-service-version-control)
    - [Mock data generator](#cap-service-mock-data-generator)
- [Build the distribution app](#build-the-distribution-app)
- [Tests](#tests)
- [Contribution guideline](#contribution-guideline)

## ⚙️ Requirements

- Nodejs
- Yarn or NPM
- The [Plug extension](#plug-extension)
- The [DFX SDK](https://smartcontracts.org/) to run the CLI

## 🤔 Getting started

The project is split into different packages and uses [Lerna](https://lerna.js.org/), a tool to manage multiple packages in a monorepo.

Use the Lerna boostrap command to install and link the packages and their dependencies.

```sh
lerna bootstrap
```

### ⚡ Dashboard development

To launch the main `Dashboard` UI development is quite simple:

```sh
yarn dev:dashboard
```

Although, for local development the `CAP Service` is required, unless running in E2E environment, which skips the Service by providing mock data.

### The CAP Service

On development, `CAP Explorer` runs against the CAP canister within the local replica network, a such you have [CAP](https://github.com/psychedelic/cap) as a submodule (if you're already running the Service separatily on your own, feel free to skip these steps).

After you clone the `CAP Explorer` repository you have to pull the `CAP` submodule content as follows:

```sh
yarn cap:init
```

You only need to do it once, for example, after you cloned the `CAP Explorer` repository.

>Note: Make sure you have the [DFX SDK](https://smartcontracts.org/) installed to run the DFX cli, otherwise visit the [Dfinity](https://dfinity.org/) for instructions

Afterwards, launch the local replica in the foreground (you're advised to do so, to monitor the service, otherwise feel free to add the --background flag):

```sh
dfx start --clean
```

Once the local replica is running, start the `CAP Service` (you need to initialise it in a separate terminal session/window, if the local replica is running in the background):

```sh
yarn cap:start
```

💡 If errors occur, run the following command before starting the local replica `dfx start` and `cap:start`:

```sh
yarn cap:reset
```

From then on, the Service is available and you can follow up with your development work but while contributing, you'll need to understand how to manage the [CAP Service version](#cap-service-version-control) you're creating a feature against.

#### CAP Service version control

When commiting to `CAP Explorer` the `CAP` submodule will be detached from the latest commit or `HEAD`.

This means that your contributions are in check or associated with a particular `CAP` commit, otherwise changes in the `CAP` submodule could break your changes!

To update the `CAP` submodule to be checked to latest, for example, you can use the convenient command:

```sh
yarn cap:update
```

Alternatively, you can checkout any particular commit in the `CAP` submodule by:

```sh
# go to CAP submodule repo
cd cap

# pull latest or checkout a particular commit
git pull origin main
git checkout <commit-hash>

# go back to parent repo
cd ..
```

In any case, you'll have to commit your changes from the `CAP Explorer` root of the project work directory (see above 👆 that you have `cd..`).

Here's an example:

```sh
git add cap
git commit "chore: 🤖 switched to commit of production version"
```

#### CAP Service mock data generator

On development, use the CAP Service Mock generator to get some data for testing by executing the command from the project root:

```sh
yarn cap:generate-mocks
```

The command will generate 20 mocks by default, optionally, a number can be passed to set the generator count, here's an example for 16 records:

```sh
yarn cap:generate-mocks 16
```

The process handles the creation of `Root bucket Canister` for the `Router Canister` and inserting a transaction, which while sounding trivial is a long process at time of writing.

💡 If you'd like to add more token contracts, call the `cap:generate-mocks` again.

## 💍 Tests

Run unit-tests for the `Dashboard UI` by:

```sh
yarn test:dashboard-unit
```

## 👷‍♂️ Build the distribution app

The distribution version of the Application, which is client facing, you need to consider the environment it'll be targetting.

Here're the available environments:

- Local, you'd like to test locally
- Staging, to host it remotely and make calls to a mainnet canister used for tests
- Production, to host it remotely and make calls to the mainnet production canister

Assuming that you have run the application startup guide, you'd run:

```sh
yarn build:local
```

Similarily, in a Cloud environment you'd have to setup a few environment variables, such as:

- NODE_ENV, the target environment (staging or production)
- IC_HISTORY_ROUTER_ID, the mainnet canister id (for staging or production)

In the Cloud runner, after installing all the dependencies, you'd run:

```sh
yarn build:staging
```

We've used `staging` environment as an example, where `production` is also available.

```sh
yarn build:production
```

## 🙏 Contribution guideline

Create branches from the `main` branch and name it in accordance to **conventional commits** [here](https://www.conventionalcommits.org/en/v1.0.0/), or follow the examples bellow:

```txt
test: 💍 Adding missing tests
feat: 🎸 A new feature
fix: 🐛 A bug fix
chore: 🤖 Build process or auxiliary tool changes
docs: ✏️ Documentation only changes
refactor: 💡 A code change that neither fixes a bug or adds a feature
style: 💄 Markup, white-space, formatting, missing semi-colons...
```

The following example, demonstrates how to branch-out from `main`, creating a `test/a-test-scenario` branch and commit two changes!

```sh
git checkout main

git checkout -b test/a-test-scenario

git commit -m 'test: verified X equals Z when Foobar'

git commit -m 'refactor: input value changes'
```

Here's an example of a refactor of an hypotetical `address-panel`:

```sh
git checkout main

git checkout -b refactor/address-panel

git commit -m 'fix: font-size used in the address description'

git commit -m 'refactor: simplified markup for the address panel'
```

Once you're done with your feat, chore, test, docs, task:

- Push to [remote origin](https://github.com/Psychedelic/cap-explorer.git)
- Create a new PR targeting the base **main branch**, there might be cases where you need to target to a different branch in accordance to your use-case
- Use the naming convention described above, for example PR named `test: some scenario` or `fix: scenario amend x`
- On approval, make sure you have `rebased` to the latest in **main**, fixing any conflicts and preventing any regressions
- Complete by selecting **Squash and Merge**

If you have any questions get in touch!