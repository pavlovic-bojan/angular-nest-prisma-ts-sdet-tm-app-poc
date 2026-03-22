/**
 * Baseline Test - Task Manager API
 * Minimal load: 2 VUs, 1 min
 */

import { check } from 'k6';
import { getConfig, getThresholds } from '../lib/config.js';
export { handleSummary } from '../lib/summary.js';
import { getHealth, postLogin, getUsers, getProjects, getTasks, thinkTime } from '../lib/api.js';
import { login } from '../lib/auth.js';
import { getScenarioConfig, getScenarioName } from '../lib/scenarios.js';

const testType = 'baseline';
const thresholds = getThresholds(testType);

export const options = {
  scenarios: {
    [getScenarioName(testType)]: getScenarioConfig(testType, {
      vus: parseInt(__ENV.VUS) || 2,
      duration: __ENV.DURATION || '1m',
    }),
  },
  thresholds,
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
};

export function setup() {
  const config = getConfig();
  console.log(`[BASELINE] Starting: ${config.baseUrl}, VUs: 2, 1m`);
  return { token: login() };
}

export default function (data) {
  const token = data && data.token;

  const healthRes = getHealth();
  check(healthRes, { 'baseline - health 200': (r) => r.status === 200 });

  thinkTime(0.3, 0.6);

  postLogin();
  thinkTime(0.2, 0.5);

  const usersRes = getUsers(token);
  check(usersRes, { 'baseline - users 200': (r) => r.status === 200 });

  const projectsRes = getProjects(token);
  check(projectsRes, { 'baseline - projects 200': (r) => r.status === 200 });

  const tasksRes = getTasks(token);
  check(tasksRes, { 'baseline - tasks 200': (r) => r.status === 200 });
}

export function teardown() {
  console.log('[BASELINE] Completed');
}
