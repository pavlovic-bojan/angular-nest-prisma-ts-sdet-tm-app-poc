/**
 * Smoke Test - Task Manager API
 * Validates basic system stability under minimal load.
 * - Health check (GET /)
 * - Login (POST /auth/login)
 * - Users, projects, tasks (GET) — all require JWT
 * 1 VU, 3 iterations, ~1 min
 */

import { check } from 'k6';
import { getConfig, getThresholds } from '../lib/config.js';
export { handleSummary } from '../lib/summary.js';
import { getHealth, postLogin, getUsers, getProjects, getTasks, thinkTime } from '../lib/api.js';
import { login } from '../lib/auth.js';
import { getScenarioConfig, getScenarioName } from '../lib/scenarios.js';

const testType = 'smoke';
const thresholds = getThresholds(testType);

export const options = {
  scenarios: {
    [getScenarioName(testType)]: getScenarioConfig(testType, {
      vus: parseInt(__ENV.VUS) || 1,
      iterations: parseInt(__ENV.ITERATIONS) || 3,
    }),
  },
  thresholds,
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
};

export function setup() {
  const config = getConfig();
  console.log(`[SMOKE] Starting against: ${config.baseUrl}`);
  return { token: login() };
}

export default function (data) {
  const token = data && data.token;

  const healthRes = getHealth();
  check(healthRes, {
    'smoke - health accessible': (r) => r.status === 200,
    'smoke - health response time < 2s': (r) => r.timings.duration < 2000,
  });

  thinkTime(0.3, 0.8);

  const loginRes = postLogin();
  check(loginRes, { 'smoke - login accessible': (r) => r.status === 200 || r.status === 201 });

  thinkTime(0.2, 0.5);

  const usersRes = getUsers(token);
  check(usersRes, { 'smoke - users accessible': (r) => r.status === 200 });

  const projectsRes = getProjects(token);
  check(projectsRes, { 'smoke - projects accessible': (r) => r.status === 200 });

  const tasksRes = getTasks(token);
  check(tasksRes, { 'smoke - tasks accessible': (r) => r.status === 200 });
}

export function teardown() {
  console.log('[SMOKE] Completed');
}
