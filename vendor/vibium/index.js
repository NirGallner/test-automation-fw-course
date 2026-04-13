exports.launch = async function launch(options) {
  const playwright = await import('playwright');
  return playwright.chromium.launch(options);
};
