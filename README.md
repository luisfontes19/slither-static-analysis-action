# Slither Action

This action is a wrapper for slither, a static vulnerability tool for Solidity smart contracts.

## Inputs

### `run-npm-install`

By default the action will run npm install on the source folder. Set this variable as false to disable it
***Default:*** true
***Required:*** no

### `slither-version`

Specify slither version to use. It will download it from official github project.
***Default:*** "0.6.14"
***Required:*** no


### `high-threshold`

Action will fail if the number of High findings is equal or bigger then this value (0 to disable)
***Default:*** 1
***Required:*** no

### `medium-threshold`

Action will fail if the number of Medium findings is equal or bigger then this value (0 to disable)
***Default:*** 1
***Required:*** no

### `low-threshold`

Action will fail if the number of Low findings is equal or bigger then this value (0 to disable)
***Default:*** 1
***Required:*** no

### `optimization-threshold`

Action will fail if the number of Optimization findings is equal or bigger then this value (0 to disable)
***Default:*** 1
***Required:*** no

### `informative-threshold`

Action will fail if the number of Informative findings is equal or bigger then this value (0 to disable)
***Default:*** 10
***Required:*** no

### `projectPath`

The path to the smart contract's project
***Default:*** "."
***Required:*** no

### `slither-params`

Extra slither params to be appended. By default the action runnins with: ```slither --json - .```
***Required:*** no

## Example usage

```yaml
uses: luisfontes19/slither-static-analysis@v0.3.0
```

## Full Action Example

```yaml
on: [push]

jobs:
  main_job:
    runs-on: ubuntu-latest
    name: Solidity Security 
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Slither Static Analysis
        uses: luisfontes19/slither-static-analysis@v0.3.0
        with:
          slither-version: '0.6.13'
          run-npm-install: true
          high-threshold: 1
          medium-threshold: 1
          low-threshold: 1
          optimization-threshold: 1
          informative-threshold: 10
          projectPath: "."
```

## For Developers

```bash
npm install
#do some changes
npm run build
#commit
#push
```
