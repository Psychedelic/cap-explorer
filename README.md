<div align="center" style="padding-bottom: 20px;">
  <img src="./.repo/images/cap-logo.png?202111051515" width="140px" height="auto"/>
</div>

# Cap Explorer
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-blue.svg)](https://conventionalcommits.org)

Cap Explorer is the client interface for [Cap](https://github.com/Psychedelic/cap), an open internet service to store transaction history for NFTs/Tokens.

Learn more about [Cap](https://github.com/Psychedelic/cap) by reading the original spec [here](https://github.com/Psychedelic/cap/blob/main/spec.md).

## 📒 Table of Contents 

- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Dashboard development](#dashboard-development)
  - [The CAP Service](#the-cap-service)
    - [Version control](#cap-service-version-control)
    - [Mock data generator](#cap-service-mock-data-generator)
- [Build the distribution app](#build-the-distribution-app)
- [Configure NPM for Github Package Registry](#configure-npm-for-github-package-registry)
- [Tests](#tests)
- [Profiler](#profiler)
- [Contribution guideline](#contribution-guideline)

## ⚙️ Requirements

- Nodejs
- Yarn or NPM
- The [Plug extension](#plug-extension)
- The [DFX SDK](https://smartcontracts.org/) to run the CLI
- Configure NPM for [Github Package Registry](https://github.com/features/packages)

## 🤔 Getting started

The project is split into different packages and uses [Lerna](https://lerna.js.org/), a tool to manage multiple packages in a monorepo.

Use the Lerna boostrap command to install and link the packages and their dependencies.

```sh
lerna bootstrap
```

### ⚡ Dashboard development

To launch the main `Dashboard` UI development is quite simple:

```sh
yarn dev:dashboard-dev
```

Although, for local development the `CAP Service` is required, unless running in MOCKUP environment, which skips the Service by providing mock data.

Optionally, you might want to dev with mainnet data:

```sh
yarn dev:dashboard-prod
```

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
- MOCKUP, if present the data to present will be fake (dynamically generated in the client-side, this can be useful for staging or testing environment)

In the Cloud runner, after installing all the dependencies, you'd run:

```sh
yarn build:staging
```

We've used `staging` environment as an example, where `production` is also available.

```sh
yarn build:production
```

Bear in mind that the [Psychedelic](https://github.com/psychedelic) keeps packages in the Github Registry, so you need to make sure you have setup a `Personal Access Token` to read from Github registry. If you haven't setup, or you're required to build the cloud for staging, production then find the instructions [here](#configure-npm-for-github-package-registry)

## 🔫  Staging

The Staging url can be found [here](https://zx4fi-ryaaa-aaaad-qa4ya-cai.ic.fleek.co) and should be in sync with the lastest succesfull build and deploy in the HEAD of [develop branch](https://github.com/Psychedelic/cap-explorer/commits/develop).

[https://zx4fi-ryaaa-aaaad-qa4ya-cai.ic.fleek.co](https://zx4fi-ryaaa-aaaad-qa4ya-cai.ic.fleek.co)

## 👻 Configure NPM for Github Package Registry

You'll need to have @Psychedelic Github Package Registry setup, if you haven't done for other projects find out how here.


To pull and install from [@Psychedelic](https://github.com/psychedelic) via the NPM CLI, you'll need:

- A personal access token (you can create a personal acess token [here](https://github.com/settings/tokens))
- The personal access token with the correct scopes, **repositories**, **org repositories** and **read:packages** to be granted access to the [GitHub Package Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

- Authentication via `npm login`, using your Github email for the **username** and the **personal access token** as your **password**:

Once you have those ready, run:

```sh
npm login --registry=https://npm.pkg.github.com --scope=@psychedelic
```

> **Note:** You only need to configure this once to install the package!
    On npm login provide your Github email as your username and the Personal access token as the password.

You can also setup your npm global settings to fetch from the Github registry everytime it finds a **@Psychdelic** package:

```sh
npm set //npm.pkg.github.com/:_authToken "$PAT"
```

⚠️ Alternatively, a token could be passed to the `.npmrc` as `//npm.pkg.github.com/:_authToken=xxxxxx` but we'd like to keep it clean, tokenless. Here's an example where the `PAT` is an environment variable:

```sh
@psychedelic:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${PAT}
```

Whichever option is best for you, you'll then be able to install packages from `@psychedelic`, such as the `@psychedelic/cap-js`.

## 💄 Styling components

Our stylesheets are created with [Stitches](https://stitches.dev/), a CSS-in-JS with best-in-class developer experience.

Our icons are managed with [Icomoon Web App](https://icomoon.io/), that generates the icon fonts for us and placed in-componet by our font toolking [Fleekon](https://github.com/FleekHQ/fleekon).

## ⚡️ Profiler

Generate statistics about the modules for the dashboard, by running the profiler command:

```sh
yarn profiler:dashboard
```

The webpack bundle analyzer will start and if your OS allows it, open the dashboard in the default browser of your OS.

Optionaly, find the `webpack-stats.json` in the `packages/dashboard` and upload it to [webpack analyse](https://webpack.github.io/analyse/).

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