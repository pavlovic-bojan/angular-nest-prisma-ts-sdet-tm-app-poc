import { setCommonPlugins } from "@codeceptjs/configure";
import * as os from "os";

setCommonPlugins();

const apiBaseUrl =
  process.env.API_BASE_URL || process.env.BASE_URL || "http://localhost:3000";

export const config = {
  name: "e2e-api",
  tests: "./e2e/**/*_test.ts",
  output: "./output",
  gherkin: {
    features: "./e2e/api/features/*.feature",
    steps: ["./e2e/api/step_definitions/steps.ts"],
  },
  helpers: {
    REST: {
      endpoint: apiBaseUrl.replace(/\/$/, ""),
      defaultHeaders: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
    JSONResponse: {},
    SchemaValidator: {
      require: "./e2e/helpers/SchemaValidator.ts",
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
        project: "Task Manager API",
      },
    },
  },
};
