import { HelloWorldPage } from '../pages/hello-world.page';

export class HelloWorldFlow {
  private page: HelloWorldPage;

  constructor(page: HelloWorldPage) {
    this.page = page;
  }

  runHelloWorld(): void {
    this.page.greet();
  }
}
