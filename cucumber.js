module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["src/**/*.ts"],
    paths: ["tests/layer1-gherkin/**/*.feature"],
    format: ["progress", "html:reports/cucumber-report.html"],
    parallel: 1
  }
};
