/// <reference path="../../../types/codeceptjs-mocha.d.ts" />
import { Given, When, Then } from "codeceptjs/lib/mocha/bdd";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { I, loginPage, tasksPage, usersPage, projectsPage } = inject() as any;

// ---- Auth ----
Given("I am on the login page", async () => {
  await loginPage.goto();
});

Given("I am logged in as demo user", async () => {
  await loginPage.goto();
  await loginPage.login("demo@example.com", "password123");
  await I.waitInUrl("tasks");
});

When("I login with email {string} and password {string}", async (email: string, password: string) => {
  await loginPage.login(email, password);
});

When("I enter email {string}", async (email: string) => {
  await loginPage.fillEmail(email);
});

When("I enter password {string}", async (password: string) => {
  await loginPage.fillPassword(password);
});

When("I click the Login button", async () => {
  await loginPage.submit();
});

Then("I should see the login page", async () => {
  const heading = await loginPage.getPageHeading();
  if (heading !== "Login") {
    throw new Error(`Expected heading "Login", got "${heading}"`);
  }
});

Then("I should see error message {string}", async (message: string) => {
  const error = await loginPage.getErrorMessage();
  if (!error.includes(message)) {
    throw new Error(`Expected error to contain "${message}", got "${error}"`);
  }
});

Then("I should be redirected to the tasks page", async () => {
  await I.seeInCurrentUrl("/tasks");
});

// ---- Navigation ----
Given("I am on the tasks page", async () => {
  await tasksPage.goto();
});

Given("I am on the users page", async () => {
  await usersPage.goto();
});

Given("I am on the projects page", async () => {
  await projectsPage.goto();
});

When("I navigate to Tasks", async () => {
  await I.click("[data-testid='nav-tasks']");
});

When("I navigate to Users", async () => {
  await I.click("[data-testid='nav-users']");
});

When("I navigate to Projects", async () => {
  await I.click("[data-testid='nav-projects']");
});

Then("I should see the tasks page", async () => {
  const heading = await tasksPage.getPageHeading();
  if (!heading.includes("Tasks")) {
    throw new Error(`Expected heading to contain "Tasks", got "${heading}"`);
  }
});

Then("I should see the users page", async () => {
  const heading = await usersPage.getPageHeading();
  if (!heading.includes("Users")) {
    throw new Error(`Expected heading to contain "Users", got "${heading}"`);
  }
});

Then("I should see the projects page", async () => {
  const heading = await projectsPage.getPageHeading();
  if (!heading.includes("Projects")) {
    throw new Error(`Expected heading to contain "Projects", got "${heading}"`);
  }
});

Then("I should be on the tasks page", async () => {
  await I.seeInCurrentUrl("/tasks");
});

Then("I should be on the users page", async () => {
  await I.seeInCurrentUrl("/users");
});

Then("I should be on the projects page", async () => {
  await I.seeInCurrentUrl("/projects");
});

// ---- Tasks ----
Given("I am on the tasks list", async () => {
  await tasksPage.goto();
});

When("I click Add Task", async () => {
  await tasksPage.clickAddTask();
});

Then("I should see the tasks list", async () => {
  const heading = await tasksPage.getPageHeading();
  if (!heading.includes("Tasks")) {
    throw new Error(`Expected "Tasks", got "${heading}"`);
  }
});

Then("the tasks page should be displayed", async () => {
  const heading = await tasksPage.getPageHeading();
  if (!heading.includes("Tasks")) {
    throw new Error(`Expected "Tasks", got "${heading}"`);
  }
});

Then("I should see empty tasks state", async () => {
  await I.seeElement("[data-testid='tasks-empty']");
});

Then("I should see empty users state", async () => {
  await I.seeElement("[data-testid='users-empty']");
});

Then("I should see empty projects state", async () => {
  await I.seeElement("[data-testid='projects-empty']");
});

// ---- Users ----
When("I click Add User", async () => {
  await I.click("[data-testid='add-user-btn']");
});

Then("I should see the users list", async () => {
  const heading = await usersPage.getPageHeading();
  if (!heading.includes("Users")) {
    throw new Error(`Expected "Users", got "${heading}"`);
  }
});

// ---- Projects ----
When("I click Add Project", async () => {
  await I.click("[data-testid='add-project-btn']");
});

Then("I should see the projects list", async () => {
  const heading = await projectsPage.getPageHeading();
  if (!heading.includes("Projects")) {
    throw new Error(`Expected "Projects", got "${heading}"`);
  }
});

// ---- Task Form ----
When("I fill task title {string}", async (title: string) => {
  await I.fillField("[data-testid='task-title']", title);
});

When("I fill task description {string}", async (desc: string) => {
  await I.fillField("[data-testid='task-description']", desc);
});

When("I submit task form", async () => {
  await I.click("[data-testid='task-form-submit']");
});

When("I cancel task form", async () => {
  await I.click("[data-testid='task-form-cancel']");
});

Then("the task drawer should be visible", async () => {
  await I.seeElement("[data-testid='drawer']");
});

Then("I should see element {string}", async (selector: string) => {
  await I.seeElement(selector);
});

// ---- User Form ----
When("I fill user name {string}", async (name: string) => {
  await I.fillField("[data-testid='user-name']", name);
});

When("I fill user email {string}", async (email: string) => {
  await I.fillField("[data-testid='user-email']", email);
});

When("I fill user role {string}", async (role: string) => {
  await I.fillField("[data-testid='user-role']", role);
});

When("I submit user form", async () => {
  await I.click("[data-testid='user-form-submit']");
});

When("I cancel user form", async () => {
  await I.click("[data-testid='user-form-cancel']");
});

// ---- Project Form ----
When("I fill project name {string}", async (name: string) => {
  await I.fillField("[data-testid='project-name']", name);
});

When("I fill project description {string}", async (desc: string) => {
  await I.fillField("[data-testid='project-description']", desc);
});

When("I submit project form", async () => {
  await I.click("[data-testid='project-form-submit']");
});

When("I cancel project form", async () => {
  await I.click("[data-testid='project-form-cancel']");
});

// ---- Logout ----
When("I open user menu", async () => {
  await I.click("[data-testid='user-menu-btn']");
});

When("I click Logout", async () => {
  await I.click("[data-testid='logout-btn']");
});

Then("I should be on the login page", async () => {
  await I.seeInCurrentUrl("/login");
});

// ---- Confirm Dialog ----
When("I confirm deletion", async () => {
  await I.click("[data-testid='confirm-dialog-confirm']");
});

When("I cancel deletion", async () => {
  await I.click("[data-testid='confirm-dialog-cancel']");
});
