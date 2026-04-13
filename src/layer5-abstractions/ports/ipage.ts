import { IElement } from './ielement';

export interface IPage {
  goto(url: string): Promise<void>;
  title(): Promise<string>;
  find(selector: string): Promise<IElement>;
}
