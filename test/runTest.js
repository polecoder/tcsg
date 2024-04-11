const path = require("path");
const { runTests } = require("@vscode/test-electron");
const { createTestFolder } = require("./suiteSetup");

async function main() {
  try {
    const testFolderPath = await createTestFolder();
    const extensionDevelopmentPath = path.resolve(__dirname, "..");

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath: path.resolve(__dirname, "./suite/workspace"),
      launchArgs: [testFolderPath, "--disable-extensions"],
    });
    console.log("$$$ TEST FOLDER CREATED AT ", testFolderPath);

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath: path.resolve(__dirname, "./suite/noWorkspace"),
      launchArgs: ["--disable-extensions"],
    });
  } catch (err) {
    console.error(err);
    console.error("Failed to run tests");
    process.exit(1);
  }
}

main();
