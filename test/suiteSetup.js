const vscode = require("vscode");
const assert = require("assert");
const path = require("path");
const fs = require("fs");
const os = require("os");

/**
 * @brief Create a test folder for the extension's tests.
 *
 * The created folder will be located in the system's temporary directory.
 *
 * @returns {Promise<void>}
 */
async function createTestFolder() {
  const testWorkspacePath = path.join(os.tmpdir(), "vscode-test-tcsg");
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
}

/**
 * @brief Global configuration for the test suite.
 *
 * This function is called before the test suite starts.
 *
 * @returns {Promise<void>}
 */
async function globalSetup() {
  // Creo la carpeta de pruebas
  await createTestFolder();
  // Abrir el workspace de pruebas ubicado en la carpeta temporal del equipo
  const testWorkspaceUri = vscode.Uri.file(
    path.resolve(os.tmpdir(), "vscode-test-tcsg")
  );
  assert.ok(
    fs.existsSync(testWorkspaceUri.fsPath),
    "Test workspace not found."
  );
  await vscode.commands.executeCommand("vscode.openFolder", testWorkspaceUri);
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

/**
 * @brief Global teardown for the test suite.
 *
 * This function is called after the test suite ends.
 *
 * @returns {Promise<void>}
 */
async function globalTeardown() {
  // Limpiar el workspace de pruebas
  const workspacePath = path.resolve(os.tmpdir(), "vscode-test-tcsg");
  if (fs.existsSync(workspacePath)) {
    fs.rmSync(workspacePath, { recursive: true });
  }
  console.log("[globalTeardown] - Workspace cleaned.");
}

module.exports = {
  globalSetup,
  globalTeardown,
};
