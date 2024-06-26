const vscode = require("vscode");
const assert = require("assert");

suite("[buildProject] No workspace tests", async function () {
  /**
   * Test case for the buildProject command.
   * This test case will check if an error is thrown when there is no workspace folder.
   */
  test("[NW-0] - No workspace folder", async function () {
    try {
      await vscode.commands.executeCommand("tcsg.buildProject");
      assert.fail("buildProject did not throw an error as expected");
    } catch (err) {
      assert.strictEqual(
        err.message,
        "No workspace folder found. Terminating process.",
        "buildProject did not throw the expected error"
      );
    }
  });
});
