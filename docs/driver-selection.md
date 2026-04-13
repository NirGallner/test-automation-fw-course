# Driver Selection

The same Gherkin scenarios and step definitions can run on different engines by setting one environment variable.

## Playwright (default)

DRIVER_ENGINE=playwright npm run test:smoke

## Vibium

DRIVER_ENGINE=vibium npm run test:smoke

## Selenium (design scope)

DRIVER_ENGINE=selenium npm run test:smoke

Selenium is wired in runtime selection for contract completeness, but executable parity for this feature remains Playwright and Vibium.

## Invalid value behavior

Any value outside playwright, vibium, selenium fails fast before scenario execution:

Invalid DRIVER_ENGINE value: <value>. Expected one of: playwright, vibium, selenium.

## Run parity checks

npm run test:drivers

No layer 1-4 code changes are required to swap engines.

## Lifecycle fixture behavior

- Hook lifecycle labels (`BeforeAll`, `Before`, `After`, `AfterAll`) are emitted regardless of selected engine.
- Fixture labels (`globalServer Start/End`, `testDatabase Start/End`) are emitted only for scenarios tagged with `@fixtures` (or configured fixture tags).
- The same fixture opt-in behavior must remain stable for Playwright and Vibium runs.
