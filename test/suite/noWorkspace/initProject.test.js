const vscode = require("vscode");
const assert = require("assert");

suite("[initProject] No workspace tests", async function () {
  /**
   * Test case for the initProject command.
   * This test case will check if an error is thrown when there is no workspace folder.
   */
  test("[NW-0] - No workspace folder", async function () {
    try {
      await vscode.commands.executeCommand("tcsg.initProject");
      assert.fail("initProject did not throw an error as expected");
    } catch (err) {
      assert.strictEqual(
        err.message,
        "No workspace folder found. Terminating process.",
        "initProject did not throw the expected error"
      );
    }
  });
});
