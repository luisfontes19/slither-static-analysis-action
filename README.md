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


### `failOnHighResults`

Action will fail if the number of High findings is equal or bigger then this value (0 to disable)
***Default:*** 1
***Required:*** no

### `failOnMediumResults`

Action will fail if the number of Medium findings is equal or bigger then this value (0 to disable)
***Default:*** 1
***Required:*** no

### `failOnLowResults`

Action will fail if the number of Low findings is equal or bigger then this value (0 to disable)
***Default:*** 1
***Required:*** no

### `failOnOptimizationResults`

Action will fail if the number of Optimization findings is equal or bigger then this value (0 to disable)
***Default:*** 1
***Required:*** no

### `failOnInformativeResults`

Action will fail if the number of Informative findings is equal or bigger then this value (0 to disable)
***Default:*** 10
***Required:*** no

### `projectPath`

The path to the smart contract's project
***Default:*** "."
***Required:*** no

## Example usage

```yaml
uses: luisfontes19/slither-static-analysis@v0.2.0
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
        uses: luisfontes19/slither-static-analysis@v0.2.0
        with:
          slither-version: '0.6.13'
          run-npm-install: true
          failOnHighResults: 1
          failOnMediumResults: 1
          failOnLowResults: 1
          failOnOptimizationResults: 1
          failOnInformativeResults: 10
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
