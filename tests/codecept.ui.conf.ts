import path from "path";
import { setCommonPlugins, setHeadlessWhen } from "@codeceptjs/configure";
import * as os from "os";

setHeadlessWhen(process.env.HEADLESS !== "false");
setCommonPlugins();

export const config = {
  name: "e2e-ui",
  tests: "./e2e/**/*_test.ts",
  output: "./output",
  gherkin: {
    features: "./e2e/ui/features/*.feature",
    steps: ["./e2e/ui/step_definitions/steps.ts"],
  },
  helpers: {
    Playwright: {
      url: "http://localhost:4200",
      show: process.env.HEADLESS === "false",
      browser: "chromium",
      restart: "context",
      waitForNavigation: "domcontentloaded",
    },
  },
  plugins: {
    allure: {
      enabled: true,
      require: "allure-codeceptjs",
      outputDir: "./allure-results",
      environmentInfo: {
        os_platform: os.platform(),
        os_release: os.release(),
        node_version: process.version,
        project: "Task Manager UI",
      },
    },
  },
  include: {
    loginPage: "./e2e/ui/pages/LoginPage.ts",
    tasksPage: "./e2e/ui/pages/TasksPage.ts",
    usersPage: "./e2e/ui/pages/UsersPage.ts",
    projectsPage: "./e2e/ui/pages/ProjectsPage.ts",
  },
};
