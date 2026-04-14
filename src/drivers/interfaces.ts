export interface IBrowser {
  launch(): Promise<IPage>;
  close(): Promise<void>;
}

export interface IPage {
  navigate(url: string): Promise<void>;
  close(): Promise<void>;
}

export interface IElement {
  click(): Promise<void>;
  type(text: string): Promise<void>;
  getText(): Promise<string>;
}
