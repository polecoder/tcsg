const vscode = require("vscode");
const assert = require("assert");
const path = require("path");
const fs = require("fs");
const { resetTestFolder } = require("./suiteSetup");

suite("[initProject] With workspace tests", async function () {
  this.timeout(150000);

  teardown(resetTestFolder);

  /**
   * Test case for the initProject command.
   * 1) This test case will check if a project with basic files is initialized correctly.
   * 2) This test case will check if the scripts are created correctly when the I/O files are not setup in the VSCode config.
   */
  test("[WW-0] - No I/O files", async function () {
    this.timeout(50000);
    const prettierExpectedConfigContent = {
      plugins: ["prettier-plugin-tailwindcss"],
    };

    const packageExpectedScripts = {
      "format-all": "prettier --write .",
      "tailwind-build": 'tailwindcss -i "" -o ""',
      "minify-css": 'cleancss -o "" ""',
      "minify-js": "",
      prep: "npm run tailwind-build && npm run minify-css && npm run minify-js",
    };

    const expectedFiles = [
      ".prettierrc",
      "tailwind.config.js",
      "package.json",
      "package-lock.json",
    ];

    const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    await vscode.commands.executeCommand("tcsg.initProject");

    expectedFiles.forEach((file) => {
      const filePath = path.resolve(workspacePath, file);
      assert.ok(
        fs.existsSync(filePath),
        `${file} should exist after initProject command`
      );
    });

    const prettierConfigPath = path.resolve(workspacePath, ".prettierrc");
    const prettierConfigJSON = JSON.parse(
      fs.readFileSync(prettierConfigPath, "utf8")
    );
    assert.deepStrictEqual(
      prettierConfigJSON,
      prettierExpectedConfigContent,
      ".prettierrc content is not as expected"
    );

    const packagePath = path.resolve(workspacePath, "package.json");
    const packageJSON = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    assert.deepStrictEqual(
      packageJSON.scripts,
      packageExpectedScripts,
      "package.json scripts are not as expected"
    );
  });

  /**
   * Test case for the initProject command.
   * This test case will check if the scripts are created correctly when the I/O files are correctly setup in the VSCode config.
   */
  test("[WW-1] - With I/O files", async function () {
    this.timeout(50000);
    const inputRelativePath = path.join("css", "input.css");
    const outputRelativePath = path.join("css", "output.css");
    const minOutputRelativePath = path.join("css", "output.min.css");
    const packageExpectedScripts = {
      "format-all": "prettier --write .",
      "tailwind-build": `tailwindcss -i "${inputRelativePath}" -o "${outputRelativePath}"`,
      "minify-css": `cleancss -o "${minOutputRelativePath}" "${outputRelativePath}"`,
      "minify-js": "",
      prep: "npm run tailwind-build && npm run minify-css && npm run minify-js",
    };

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

    const packagePath = path.resolve(workspacePath, "package.json");
    const packageJSON = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    assert.deepStrictEqual(
      packageJSON.scripts,
      packageExpectedScripts,
      "package.json scripts are not as expected"
    );
  });

  /**
   * Test case for the initProject command.
   * This test case will check if the command throws an error when the project is already initialized.
   */
  test("[WW-2] - Project already initialized", async function () {
    this.timeout(50000);
    await vscode.commands.executeCommand("tcsg.initProject");

    try {
      await vscode.commands.executeCommand("tcsg.initProject");
      assert.fail("initProject did not throw an error as expected");
    } catch (err) {
      assert.strictEqual(
        err.message,
        "Project already initialized. Terminating process.",
        "initProject did not throw the expected error"
      );
    }
  });
});
