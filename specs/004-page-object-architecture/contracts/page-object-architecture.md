# Contract: Page Object Architecture

## Interfaces
- IBrowser
- IPage
- IElement
- Driver Registry

## Contract Format
- All interfaces must be implemented in src/layer5-abstractions/ports/
- No Playwright-specific types exposed above Layer 5
- All navigation methods return the next Page Object
- All selectors are private and follow locator priority
- All code is documented
