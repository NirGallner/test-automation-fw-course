# Driver Selection

The same Gherkin scenarios and step definitions can run on different drivers by setting one environment variable.

## Playwright (default)

DRIVER_ENGINE=playwright npm run test:smoke

## Vibium

DRIVER_ENGINE=vibium npm run test:smoke

## Run parity checks

npm run test:drivers

No layer 1-4 code changes are required to swap engines.
