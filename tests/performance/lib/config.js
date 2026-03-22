/**
 * k6 Configuration Module for Task Manager API
 * Handles environment-specific configuration and constants
 */

/**
 * Get environment configuration from environment variables
 * @returns {Object} Configuration object with baseUrl, etc.
 */
export function getConfig() {
  const baseUrl = __ENV.BASE_URL || __ENV.TM_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      'BASE_URL or TM_BASE_URL environment variable is required. ' +
        'Example: BASE_URL=http://localhost:3000'
    );
  }

  const url = baseUrl.replace(/\/+$/, '');

  return {
    baseUrl: url,
    endpoints: {
      health: '/',
      login: '/auth/login',
      users: '/users',
      projects: '/projects',
      tasks: '/tasks',
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    loginPayload: {
      email: __ENV.LOGIN_EMAIL || 'demo@example.com',
      password: __ENV.LOGIN_PASSWORD || 'password123',
    },
  };
}

/**
 * Get thresholds configuration based on test type (minimum for CI)
 * @param {string} testType - Type of test (smoke, baseline, load, etc.)
 * @returns {Object} k6 thresholds object
 */
export function getThresholds(testType) {
  const baseThresholds = {
    http_req_duration: ['p(95)<3000', 'p(99)<5000'],
    http_req_failed: ['rate<0.05'],
    checks: ['rate>0.90'],
  };

  switch (testType) {
    case 'smoke':
      return {
        ...baseThresholds,
        http_req_duration: ['p(95)<2000', 'p(99)<4000'],
        http_req_failed: ['rate<0.05'],
      };
    default:
      return baseThresholds;
  }
}
