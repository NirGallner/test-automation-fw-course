import { logger } from '../utils/logger';

export class HelloWorldPage {
  greet(): void {
    logger.info({ layer: 'page', class: 'HelloWorldPage' }, 'Hello, World!');
  }
}
