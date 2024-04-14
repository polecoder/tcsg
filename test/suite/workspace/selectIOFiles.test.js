const sinon = require("sinon");
const vscode = require("vscode");
const assert = require("assert");
const path = require("path");
const { resetTestFolder } = require("./suiteSetup");

suite("[selectIOFiles] With workspace tests", function () {
  let showQuickPickStub, showOpenDialogStub;

  setup(function () {
    showQuickPickStub = sinon.stub(vscode.window, "showQuickPick");
    showOpenDialogStub = sinon.stub(vscode.window, "showOpenDialog");
  });

  teardown(async function () {
    sinon.restore();

    await resetTestFolder();
  });

  suiteTeardown(async function () {
    const config = vscode.workspace.getConfiguration("tcsg");
    await config.update(
      "tailwindInputFilePath",
      "",
      vscode.ConfigurationTarget.Workspace
    );
    await config.update(
      "tailwindOutputFilePath",
      "",
      vscode.ConfigurationTarget.Workspace
    );
  });

  /**
   * Test case for the selectIOFiles command.
   * This test case will check when the I/O files are selected for the first time.
   */
  test("[WW-0] - Select I/O files for the first time", async function () {
    const inputRelativePath = path.join("css", "input.css");
    const outputRelativePath = path.join("css", "output.css");
    const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    showOpenDialogStub
      .onFirstCall()
      .resolves([{ fsPath: path.resolve(workspacePath, inputRelativePath) }]);
    showOpenDialogStub
      .onSecondCall()
      .resolves([{ fsPath: path.resolve(workspacePath, outputRelativePath) }]);

    await vscode.commands.executeCommand("tcsg.selectIOFiles");

    const config = vscode.workspace.getConfiguration("tcsg");
    const inputFilePath = config.get("tailwindInputFilePath");
    const outputFilePath = config.get("tailwindOutputFilePath");

    assert.strictEqual(
      inputFilePath,
      path.resolve(workspacePath, inputRelativePath),
      "Input file path should be set"
    );
    assert.strictEqual(
      outputFilePath,
      path.resolve(workspacePath, outputRelativePath),
      "Output file path should be set"
    );
  });

  /**
   * Test case for the selectIOFiles command.
   * This test case will check if an error is thrown when the user doesn't select the input file.
   */
  test("[WW-1] - Select I/O files for the first time, user doesn't select input", async function () {
    const outputRelativePath = path.join("css", "output.css");
    const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    showOpenDialogStub.onFirstCall().resolves(undefined);
    showOpenDialogStub
      .onSecondCall()
      .resolves([{ fsPath: path.resolve(workspacePath, outputRelativePath) }]);
    showQuickPickStub.resolves("Yes, select new files");

    try {
      await vscode.commands.executeCommand("tcsg.selectIOFiles");
      assert.fail("selectIOFiles did not throw an error as expected");
    } catch (err) {
      assert.strictEqual(
        err.message,
        "No input file selected. Terminating process.",
        "selectIOFiles did not throw the expected error"
      );
    }
  });

  /**
   * Test case for the selectIOFiles command.
   * This test case will check if an error is thrown when the user doesn't select the output file.
   */
  test("[WW-2] - Select I/O files for the first time, user doesn't select output", async function () {
    const inputRelativePath = path.join("css", "input.css");
    const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    showOpenDialogStub
      .onFirstCall()
      .resolves([{ fsPath: path.resolve(workspacePath, inputRelativePath) }]);
    showOpenDialogStub.onSecondCall().resolves(undefined);
    showQuickPickStub.resolves("Yes, select new files");

    try {
      await vscode.commands.executeCommand("tcsg.selectIOFiles");
      assert.fail("selectIOFiles did not throw an error as expected");
    } catch (err) {
      assert.strictEqual(
        err.message,
        "No output file selected. Terminating process.",
        "selectIOFiles did not throw the expected error"
      );
    }
  });

  /**
   * Test case for the selectIOFiles command.
   * This test case will check if the nothing changes if the user decides to keep the existing I/O files.
   */
  test("[WW-3] - Select I/O files, user keeps files", async function () {
    showQuickPickStub.resolves("No, use existing files");
    const config = vscode.workspace.getConfiguration("tcsg");
    const inputFilePath = config.get("tailwindInputFilePath");
    const outputFilePath = config.get("tailwindOutputFilePath");

    await vscode.commands.executeCommand("tcsg.selectIOFiles");

    assert.strictEqual(
      inputFilePath,
      config.get("tailwindInputFilePath"),
      "Input file path should not change"
    );
    assert.strictEqual(
      outputFilePath,
      config.get("tailwindOutputFilePath"),
      "Output file path should not change"
    );
  });
});
