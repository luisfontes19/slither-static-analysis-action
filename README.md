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

## Outputs

### `issues`

Found issues in the slither scan


## Example usage

```yaml
uses: luisfontes19/slither-static-analysis@v0.2.0
```

## TODO

* Allow to filter results to display. (hide by severity)
* Custom rules for failure
  * Ex. Fail if any high finding
  * Ex. Fail if more then 10 mediums
  * Ex. Ignore informative


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
```

## For Developers

```bash
npm install
#do some changes
npm run build
#commit
#push
```
