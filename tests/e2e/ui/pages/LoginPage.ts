const { I } = inject() as { I: any };

export = {
  async goto() {
    await I.amOnPage("/login");
  },

  async fillEmail(email: string) {
    await I.fillField("[data-testid='login-email']", email);
  },

  async fillPassword(password: string) {
    await I.fillField("[data-testid='login-password']", password);
  },

  async submit() {
    await I.click("[data-testid='login-submit']");
  },

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  },

  async getErrorMessage(): Promise<string> {
    try {
      const el = await I.grabTextFrom("[data-testid='login-error']");
      return Array.isArray(el) ? el[0] || "" : el || "";
    } catch {
      return "";
    }
  },

  async getPageHeading(): Promise<string> {
    const text = await I.grabTextFrom("[data-testid='login-heading']");
    return (Array.isArray(text) ? text[0] : text).trim();
  },
};
