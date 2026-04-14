// Detect if feature file paths were passed as CLI positional arguments.
// When present, cucumber-js merges them with config `paths` instead of
// overriding, so we omit `paths` from config to let CLI args take effect.
const cliHasFeaturePaths = process.argv.slice(2).some(
  (arg) => arg.endsWith('.feature') || arg.includes('.feature:')
);

const common = {
  requireModule: ["ts-node/register"],
  require: ["src/**/*.ts"],
  format: ["progress", "html:reports/cucumber-report.html"],
  parallel: 1,
  timeout: 30000
};

module.exports = {
  default: {
    ...common,
    ...(cliHasFeaturePaths ? {} : { paths: ["tests/layer1-gherkin/**/*.feature"] })
  }
};
