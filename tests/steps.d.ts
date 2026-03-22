/// <reference types='codeceptjs' />
type loginPage = typeof import('./e2e/ui/pages/LoginPage');
type tasksPage = typeof import('./e2e/ui/pages/TasksPage');
type usersPage = typeof import('./e2e/ui/pages/UsersPage');
type projectsPage = typeof import('./e2e/ui/pages/ProjectsPage');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any, loginPage: loginPage, tasksPage: tasksPage, usersPage: usersPage, projectsPage: projectsPage }
  interface Methods extends Playwright {}
  interface I extends WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
