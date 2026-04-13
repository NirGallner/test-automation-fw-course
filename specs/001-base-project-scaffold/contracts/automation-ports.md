# Contract: Tool-Agnostic Automation Ports

## Scope

This contract defines the public automation interfaces consumed by Layers 1-4.
Only Layer 5 adapters may depend on Playwright implementation details.

## Interface Contract: IBrowser

```ts
export interface IBrowser {
  newPage(): Promise<IPage>;
  close(): Promise<void>;
}
```

Rules:
- No Playwright types in the signature.
- Returned page must satisfy `IPage` behavior contract.

## Interface Contract: IPage

```ts
export interface IPage {
  goto(url: string): Promise<void>;
  title(): Promise<string>;
  find(selector: string): Promise<IElement>;
}
```

Rules:
- `goto` accepts externally reachable URL values.
- `title` returns a string (empty string allowed only when page has no title).
- `find` resolves to an `IElement` abstraction, never a Playwright `Locator`.

## Interface Contract: IElement

```ts
export interface IElement {
  textContent(): Promise<string>;
  isVisible(): Promise<boolean>;
  click(): Promise<void>;
}
```

Rules:
- Behaviors are adapter-agnostic and implementation-independent.
- Visibility and text querying semantics must be documented by adapters if they
  differ from default Playwright behavior.

## Adapter Contract: Playwright Adapter

- Allowed imports: `@playwright/test` and other Playwright packages.
- Forbidden outside adapter layer: `Page`, `Browser`, `Locator`, `BrowserContext`.
- Must implement all methods from `IBrowser`, `IPage`, `IElement`.
- Must translate Playwright exceptions into typed errors routed to `ExceptionManager`.

## Layering Constraints

- Layers 1-4 MUST only import ports from the abstractions layer.
- Step Definitions MUST not instantiate Playwright classes.
- Page Objects MUST not leak selector engine specifics beyond stable selector strings.

## Versioning

- Contract version: `v1`.
- Any breaking signature change requires a spec update and a corresponding plan/tasks update.
