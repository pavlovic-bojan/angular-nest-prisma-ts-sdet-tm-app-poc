/// <reference path="../../../types/codeceptjs-mocha.d.ts" />
import { Given, When, Then } from "codeceptjs/lib/mocha/bdd";
import { apiContext, resolveUrl } from "../context";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { I } = inject() as { I: any };

// ---- Setup: authenticate (called from Background in each feature) ----
Given("I am authenticated", async () => {
  if (!apiContext.authToken) {
    const res = await I.sendPostRequest("/auth/login", {
      email: "demo@example.com",
      password: "password123",
    });
    apiContext.authToken = (res.data as { access_token: string }).access_token;
  }
  I.haveRequestHeaders({ Authorization: `Bearer ${apiContext.authToken}` });
});

// ---- App ----
When("I send a GET request to {string}", async (url: string) => {
  apiContext.lastResponse = await I.sendGetRequest(resolveUrl(url));
});

Then("the response body equals {string}", async (expected: string) => {
  const response = apiContext.lastResponse;
  if (!response) throw new Error("No response captured. Did a request run before this step?");
  const actual =
    typeof response.data === "string" ? response.data : JSON.stringify(response.data);
  if (actual !== expected) {
    throw new Error(`Expected body "${expected}", got "${actual}"`);
  }
});

Then("the response status is {int}", async (code: number) => {
  const response = apiContext.lastResponse;
  if (!response) throw new Error("No response captured.");
  if (response.status !== code) {
    throw new Error(`Expected status ${code}, got ${response.status}`);
  }
});

Then("the response status is 200 or 201", async () => {
  const response = apiContext.lastResponse;
  if (!response) throw new Error("No response captured.");
  if (![200, 201].includes(response.status)) {
    throw new Error(`Expected status 200 or 201, got ${response.status}`);
  }
});

// ---- Auth ----
Then("the response matches LoginResponse schema", async () => {
  await I.seeResponseMatchesSchema("LoginResponse");
});

Then("the response contains {string} with value {string}", async (key: string, value: string) => {
  const response = apiContext.lastResponse;
  if (!response) throw new Error("No response captured.");
  const data = response.data;
  const actual = typeof data === "object" && data !== null && key in data ? String((data as Record<string, unknown>)[key]) : undefined;
  if (actual !== value) {
    throw new Error(`Expected ${key}="${value}", got "${actual}"`);
  }
});

Then("the response contains {string}", async (key: string) => {
  const response = apiContext.lastResponse;
  if (!response) throw new Error("No response captured.");
  const data = response.data;
  if (typeof data !== "object" || data === null || !(key in (data as object))) {
    throw new Error(`Expected response to contain key "${key}"`);
  }
});

Then("the response does not contain {string}", async (key: string) => {
  const response = apiContext.lastResponse;
  if (!response) throw new Error("No response captured.");
  const data = response.data;
  if (typeof data === "object" && data !== null && key in data) {
    throw new Error(`Expected response to not contain "${key}"`);
  }
});

// ---- Users ----
Given("I have created a user via API", async () => {
  const email = `test-${Date.now()}@example.com`;
  apiContext.lastResponse = await I.sendPostRequest("/users", {
    name: "Test User",
    email,
    password: "password123",
    role: "developer",
  });
  apiContext.userId = (apiContext.lastResponse!.data as { id: string }).id;
});

// Single POST step — handles body placeholder replacement for all features
When("I send a POST request to {string} with body", async (url: string, doc: { content: string }) => {
  let bodyStr = doc.content;
  bodyStr = bodyStr.replace("$projectId", apiContext.projectId || "");
  bodyStr = bodyStr.replace("USERID", String(Date.now()));
  const body = JSON.parse(bodyStr);
  apiContext.lastResponse = await I.sendPostRequest(resolveUrl(url), body);
});

When("I send a PUT request to {string} with body", async (url: string, doc: { content: string }) => {
  const body = JSON.parse(doc.content);
  apiContext.lastResponse = await I.sendPutRequest(resolveUrl(url), body);
});

When("I send a DELETE request to {string}", async (url: string) => {
  apiContext.lastResponse = await I.sendDeleteRequest(resolveUrl(url));
});

Then("the response matches User schema", async () => {
  await I.seeResponseMatchesSchema("User");
});

Then("the response is an array where each item matches User schema", async () => {
  await I.seeResponseArrayMatchesSchema("User");
});

Then("the response matches DeleteResponse schema", async () => {
  await I.seeResponseMatchesSchema("DeleteResponse");
});

// ---- Projects ----
Given("I have created a project via API", async () => {
  apiContext.lastResponse = await I.sendPostRequest("/projects", {
    name: `Test Project ${Date.now()}`,
    description: "Test description",
  });
  apiContext.projectId = (apiContext.lastResponse!.data as { id: string }).id;
});

Then("the response matches Project schema", async () => {
  await I.seeResponseMatchesSchema("Project");
});

Then("the response is an array where each item matches Project schema", async () => {
  await I.seeResponseArrayMatchesSchema("Project");
});

// ---- Tasks ----
Given("I have created a task via API", async () => {
  if (!apiContext.projectId) {
    apiContext.lastResponse = await I.sendPostRequest("/projects", { name: `Task Project ${Date.now()}` });
    apiContext.projectId = (apiContext.lastResponse!.data as { id: string }).id;
  }
  apiContext.lastResponse = await I.sendPostRequest("/tasks", {
    title: "Test Task",
    description: "Test",
    projectId: apiContext.projectId,
    status: "todo",
    priority: "medium",
  });
  apiContext.taskId = (apiContext.lastResponse!.data as { id: string }).id;
});

Then("the response matches Task schema", async () => {
  await I.seeResponseMatchesSchema("Task");
});

Then("the response is an array where each item matches Task schema", async () => {
  await I.seeResponseArrayMatchesSchema("Task");
});
