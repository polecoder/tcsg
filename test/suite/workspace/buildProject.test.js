const vscode = require("vscode");
const assert = require("assert");
const path = require("path");
const fs = require("fs");
const { resetTestFolder } = require("./suiteSetup");

suite("[buildProject] With workspace tests", async function () {
  this.timeout(30000);

  teardown(resetTestFolder);

  /**
   * Test case for the buildProject command.
   * This test case will check if the project builds correctly when the I/O files are correctly configured.
   */
  test("[WW-0] - Build project", async function () {
    this.timeout(30000);

    const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    /* Actualizamos la configuración para agregar los archivos */
    const inputAbsolutePath = path.resolve(workspacePath, "css/input.css");
    const outputAbsolutePath = path.resolve(workspacePath, "css/output.css");
    const config = vscode.workspace.getConfiguration("tcsg");
    await config.update(
      "tailwindInputFilePath",
      inputAbsolutePath,
      vscode.ConfigurationTarget.Workspace
    );
    await config.update(
      "tailwindOutputFilePath",
      outputAbsolutePath,
      vscode.ConfigurationTarget.Workspace
    );
    await vscode.commands.executeCommand("tcsg.initProject");

    await vscode.commands.executeCommand("tcsg.buildProject");

    assert.ok(
      fs.existsSync(path.resolve(workspacePath, "css", "output.min.css")),
      "output.min.css should exist after buildProject command"
    );
  });
});
