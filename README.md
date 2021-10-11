<div align="center" style="padding-bottom: 20px;">
  <img src="./.repo/images/cap-logo.svg" width="120" height="auto"/>
</div>

# Cap Explorer
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-blue.svg)](https://conventionalcommits.org)

Cap Explorer is the client interface for [Cap](https://github.com/Psychedelic/cap), an open internet service to store transaction history for NFTs/Tokens.

Learn more about [Cap](https://github.com/Psychedelic/cap) by reading the original spec [here](https://github.com/Psychedelic/cap/blob/main/spec.md).

## ⚙️ Requirements

- Nodejs
- Yarn or NPM
- The [Plug extension](#plug-extension)

## 🤔 Getting started

The project is split into different packages and uses [Lerna](https://lerna.js.org/), a tool to manage multiple packages in a monorepo.

Use the Lerna boostrap command to install and link the packages and their dependencies.

```sh
lerna bootstrap
```


## ⚡ Development

For the main `Dashboard` UI development work, you'll fire the `dev server` by:

```sh
yarn dev:dashboard
```


## 💍 Tests

Run unit-tests for the `Dashboard UI` by:

```sh
yarn test:dashboard-unit
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