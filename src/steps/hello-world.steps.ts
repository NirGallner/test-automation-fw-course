import { Given, When, Then } from '@cucumber/cucumber';
import { HelloWorldFlow } from '../flows/hello-world.flow';
import { HelloWorldPage } from '../pages/hello-world.page';

const flow = new HelloWorldFlow(new HelloWorldPage());

Given('the project dependencies have been installed', function () {
  // Assume dependencies are installed
});

When('the test suite is executed', function () {
  // Assume test suite runs
});

Then('the hello world scenario passes with a log entry', function () {
  flow.runHelloWorld();
});
