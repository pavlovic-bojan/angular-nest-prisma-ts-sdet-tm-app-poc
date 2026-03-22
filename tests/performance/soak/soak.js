/**
 * Soak Test - Task Manager API
 * Minimal soak: 2 req/s, 1 min
 */

import { check } from 'k6';
import { getConfig, getThresholds } from '../lib/config.js';
export { handleSummary } from '../lib/summary.js';
import { getHealth, postLogin, getUsers, getProjects, getTasks, thinkTime } from '../lib/api.js';
import { login } from '../lib/auth.js';
import { getScenarioConfig, getScenarioName } from '../lib/scenarios.js';

const testType = 'soak';
const thresholds = getThresholds(testType);

export const options = {
  scenarios: {
    [getScenarioName(testType)]: getScenarioConfig(testType, {
      rate: parseInt(__ENV.RATE) || 2,
      duration: __ENV.DURATION || '1m',
    }),
  },
  thresholds,
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
};

export function setup() {
  const config = getConfig();
  console.log(`[SOAK] Starting: ${config.baseUrl}`);
  return { token: login() };
}

export default function (data) {
  const token = data && data.token;

  const healthRes = getHealth();
  check(healthRes, { 'soak - health 200': (r) => r.status === 200 });
  thinkTime(0.2, 0.5);

  postLogin();
  thinkTime(0.2, 0.5);

  const usersRes = getUsers(token);
  check(usersRes, { 'soak - users 200': (r) => r.status === 200 });

  const projectsRes = getProjects(token);
  check(projectsRes, { 'soak - projects 200': (r) => r.status === 200 });

  const tasksRes = getTasks(token);
  check(tasksRes, { 'soak - tasks 200': (r) => r.status === 200 });
}

export function teardown() {
  console.log('[SOAK] Completed');
}
