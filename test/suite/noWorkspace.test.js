const vscode = require("vscode");
const assert = require("assert");

suite("[initProject] No Workspace Tests", async function () {
  this.timeout(15000);

  test("[NW-0] - No workspace folder", async function () {
    this.timeout(15000);
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
