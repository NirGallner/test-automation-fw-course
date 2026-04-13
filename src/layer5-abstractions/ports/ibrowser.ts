import { IPage } from './ipage';

/**
 * Port representing a running browser instance.
 * Adapters MUST implement this interface to allow business layers to open
 * pages and release the browser without coupling to a specific tool.
 */
export interface IBrowser {
  /** Opens a new page within the browser and returns its abstraction. */
  newPage(): Promise<IPage>;
  /** Closes the browser and frees all associated resources. */
  close(): Promise<void>;
}
