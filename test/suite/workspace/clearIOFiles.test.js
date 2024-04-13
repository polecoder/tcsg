const sinon = require("sinon");
const vscode = require("vscode");
const assert = require("assert");
const path = require("path");
const { resetTestFolder } = require("./suiteSetup");

suite("[clearIOFiles] With workspace tests", function () {
  this.timeout(15000);

  let showQuickPickStub;

  setup(async function () {
    showQuickPickStub = sinon.stub(vscode.window, "showQuickPick");

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
  });

  teardown(async function () {
    sinon.restore();
    resetTestFolder();
  });

  /**
   * Test case for the clearIOFiles command.
   * This test case will check if the I/O files are cleared when the user confirms the operation.
   */
  test("[WW-0] - Clear I/O files", async function () {
    this.timeout(7500);

    showQuickPickStub.resolves("Yes, clear build files");

    await vscode.commands.executeCommand("tcsg.clearIOFiles");

    const config = vscode.workspace.getConfiguration("tcsg");
    const inputFilePath = config.get("tailwindInputFilePath");
    const outputFilePath = config.get("tailwindOutputFilePath");

    assert.strictEqual(inputFilePath, "", "Input file path should be empty");
    assert.strictEqual(outputFilePath, "", "Output file path should be empty");
  });

  /**
   * Test case for the clearIOFiles command.
   * This test case will check if the I/O files are not cleared when the user cancels the operation.
   */
  test("[WW-1] - Cancel clear I/O files", async function () {
    this.timeout(7500);

    showQuickPickStub.resolves("No, leave existing files");

    await vscode.commands.executeCommand("tcsg.clearIOFiles");

    const config = vscode.workspace.getConfiguration("tcsg");
    const inputFilePath = config.get("tailwindInputFilePath");
    const outputFilePath = config.get("tailwindOutputFilePath");

    assert.notStrictEqual(
      inputFilePath,
      "",
      "Input file path should not be empty"
    );
    assert.notStrictEqual(
      outputFilePath,
      "",
      "Output file path should not be empty"
    );
  });
});
