const { I } = inject() as { I: any };

export = {
  async goto() {
    await I.click("[data-testid='nav-tasks']");
    await I.waitForVisible("[data-testid='add-task-btn']", 10);
  },

  async getPageHeading(): Promise<string> {
    return await I.grabTextFrom("[data-testid='page-heading']");
  },

  async clickAddTask() {
    await I.click("[data-testid='add-task-btn']");
  },
};
