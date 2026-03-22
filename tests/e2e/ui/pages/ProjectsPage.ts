const { I } = inject() as { I: any };

export = {
  async goto() {
    await I.click("[data-testid='nav-projects']");
    await I.waitForVisible("[data-testid='add-project-btn']", 10);
  },

  async getPageHeading(): Promise<string> {
    return await I.grabTextFrom("[data-testid='page-heading']");
  },

  async clickAddProject() {
    await I.click("[data-testid='add-project-btn']");
  },
};
