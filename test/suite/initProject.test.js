const vscode = require("vscode");
const assert = require("assert");
const path = require("path");
const fs = require("fs");
const { globalSetup, globalTeardown } = require("../suiteSetup");

suite("[initProject] [WW]", function () {
  this.timeout(60000);
  suiteSetup(globalSetup);

  /**
   * Test case for the initProject command.
   * This test case will check if a project with basic files is initialized correctly.
   * This test case will check if the scripts are created correctly when the I/O files are not setup in the VSCode config.
   */
  test("[WW-0] - No I/O files", async () => {
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
      console.log(`[initProject] [WW-0] - ${file} is created.`);
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
    console.log("[initProject] [WW-0] - .prettierrc content is as expected.");

    const packagePath = path.resolve(workspacePath, "package.json");
    const packageJSON = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    assert.deepStrictEqual(
      packageJSON.scripts,
      packageExpectedScripts,
      "package.json scripts are not as expected"
    );
    console.log("[initProject] [WW-0] - package.json scripts are as expected.");
  });

  suiteTeardown(globalTeardown);
});
