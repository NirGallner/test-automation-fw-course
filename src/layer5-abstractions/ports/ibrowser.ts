import { IPage } from './ipage';

export interface IBrowser {
  newPage(): Promise<IPage>;
  close(): Promise<void>;
}
