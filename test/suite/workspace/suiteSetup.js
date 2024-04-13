const path = require("path");
const fs = require("fs");
const os = require("os");

/**
 * @brief Reset the test folder to its initial state.
 *
 * This function will be called before each test case.
 *
 * @returns {Promise<void>}
 */
async function resetTestFolder() {
  const workspacePath = path.resolve(os.tmpdir(), "vscode-test-tcsg");
  if (fs.existsSync(workspacePath)) {
    const relativePathsToRemove = [
      ".prettierrc",
      "tailwind.config.js",
      "package.json",
      "package-lock.json",
      path.join("css", "output.min.css"),
      ".vscode",
    ];
    relativePathsToRemove.forEach((relativePath) => {
      const fullPath = path.resolve(workspacePath, relativePath);
      if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true });
      }
    });
  }
}

/**
 * @brief Create a test folder for the extension's tests.
 *
 * The created folder will be located in the system's temporary directory.
 * Returns the path to the created folder.
 *
 * @returns {Promise<string>}
 */
async function createTestFolder() {
  const testWorkspacePath = path.join(os.tmpdir(), "vscode-test-tcsg");
  if (fs.existsSync(testWorkspacePath)) {
    await resetTestFolder();
  }
  fs.mkdirSync(testWorkspacePath, { recursive: true });

  const filePaths = ["index.html", "css/input.css", "css/output.css"];
  filePaths.forEach((filePath) => {
    const fullPath = path.join(testWorkspacePath, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, "");
  });

  console.log(
    `[createTestFolder] - Test folder created at ${testWorkspacePath}.`
  );
  return testWorkspacePath;
}

module.exports = {
  resetTestFolder,
  createTestFolder,
};
