export interface IElement {
  textContent(): Promise<string>;
  isVisible(): Promise<boolean>;
  click(): Promise<void>;
}
