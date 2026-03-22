const { I } = inject() as { I: any };

export = {
  async goto() {
    await I.click("[data-testid='nav-users']");
    await I.waitForVisible("[data-testid='add-user-btn']", 10);
  },

  async getPageHeading(): Promise<string> {
    return await I.grabTextFrom("[data-testid='page-heading']");
  },

  async clickAddUser() {
    await I.click("[data-testid='add-user-btn']");
  },
};
