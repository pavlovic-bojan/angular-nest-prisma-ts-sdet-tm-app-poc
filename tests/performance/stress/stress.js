/**
 * Stress Test - Task Manager API
 * Minimal stress: 2 -> 4 VUs, ~2 min
 */

import { check } from 'k6';
import { getConfig, getThresholds } from '../lib/config.js';
export { handleSummary } from '../lib/summary.js';
import { getHealth, postLogin, getUsers, getProjects, getTasks, thinkTime } from '../lib/api.js';
import { login } from '../lib/auth.js';
import { getScenarioConfig, getScenarioName } from '../lib/scenarios.js';

const testType = 'stress';
const thresholds = getThresholds(testType);

export const options = {
  scenarios: {
    [getScenarioName(testType)]: getScenarioConfig(testType),
  },
  thresholds,
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
};

export function setup() {
  const config = getConfig();
  console.log(`[STRESS] Starting: ${config.baseUrl}`);
  return { token: login() };
}

export default function (data) {
  const token = data && data.token;

  const healthRes = getHealth();
  check(healthRes, { 'stress - health 200': (r) => r.status === 200 });
  thinkTime(0.3, 0.6);

  postLogin();
  thinkTime(0.2, 0.5);

  const usersRes = getUsers(token);
  check(usersRes, { 'stress - users 200': (r) => r.status === 200 });

  const projectsRes = getProjects(token);
  check(projectsRes, { 'stress - projects 200': (r) => r.status === 200 });

  const tasksRes = getTasks(token);
  check(tasksRes, { 'stress - tasks 200': (r) => r.status === 200 });
}

export function teardown() {
  console.log('[STRESS] Completed');
}
