/**
 * API Request Module for k6 - Task Manager API
 * Reusable API request functions for Task Manager endpoints.
 * Protected endpoints (users, projects, tasks) require a JWT token
 * obtained via login() from auth.js.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { getConfig } from './config.js';

/**
 * GET / - Health check (returns { status: "ok", timestamp: "..." })
 * @returns {Object} Response object
 */
export function getHealth() {
  const config = getConfig();
  const url = `${config.baseUrl}${config.endpoints.health}`;

  const response = http.get(url, {
    headers: { Accept: 'application/json' },
    tags: { endpoint: 'health', method: 'GET' },
  });

  check(response, {
    'health - status is 200': (r) => r.status === 200,
    'health - response time < 2s': (r) => r.timings.duration < 2000,
    'health - has status ok': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data && data.status === 'ok';
      } catch {
        return false;
      }
    },
  });

  return response;
}

/**
 * POST /auth/login - Authenticate and verify response shape
 * @returns {Object} Response object
 */
export function postLogin() {
  const config = getConfig();
  const url = `${config.baseUrl}${config.endpoints.login}`;
  const payload = JSON.stringify(config.loginPayload);

  const response = http.post(url, payload, {
    headers: config.headers,
    tags: { endpoint: 'auth/login', method: 'POST' },
  });

  check(response, {
    'login - status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'login - response time < 3s': (r) => r.timings.duration < 3000,
    'login - has access_token': (r) => {
      try {
        const data = JSON.parse(r.body);
        return typeof data.access_token === 'string' && data.access_token.length > 0;
      } catch {
        return false;
      }
    },
    'login - user email matches': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.user && data.user.email === config.loginPayload.email;
      } catch {
        return false;
      }
    },
  });

  return response;
}

/**
 * GET /users - List users (requires JWT)
 * @param {string} token - JWT access token
 * @returns {Object} Response object
 */
export function getUsers(token) {
  const config = getConfig();
  const url = `${config.baseUrl}${config.endpoints.users}`;
  const headers = {
    ...config.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = http.get(url, {
    headers,
    tags: { endpoint: 'users', method: 'GET' },
  });

  check(response, {
    'users - status is 200': (r) => r.status === 200,
    'users - response time < 2s': (r) => r.timings.duration < 2000,
    'users - returns array': (r) => {
      try {
        const data = JSON.parse(r.body);
        return Array.isArray(data);
      } catch {
        return false;
      }
    },
  });

  return response;
}

/**
 * GET /projects - List projects (requires JWT)
 * @param {string} token - JWT access token
 * @returns {Object} Response object
 */
export function getProjects(token) {
  const config = getConfig();
  const url = `${config.baseUrl}${config.endpoints.projects}`;
  const headers = {
    ...config.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = http.get(url, {
    headers,
    tags: { endpoint: 'projects', method: 'GET' },
  });

  check(response, {
    'projects - status is 200': (r) => r.status === 200,
    'projects - response time < 2s': (r) => r.timings.duration < 2000,
    'projects - returns array': (r) => {
      try {
        const data = JSON.parse(r.body);
        return Array.isArray(data);
      } catch {
        return false;
      }
    },
  });

  return response;
}

/**
 * GET /tasks - List tasks (requires JWT); returns { data: [], total, page, limit }
 * @param {string} token - JWT access token
 * @returns {Object} Response object
 */
export function getTasks(token) {
  const config = getConfig();
  const url = `${config.baseUrl}${config.endpoints.tasks}`;
  const headers = {
    ...config.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = http.get(url, {
    headers,
    tags: { endpoint: 'tasks', method: 'GET' },
  });

  check(response, {
    'tasks - status is 200': (r) => r.status === 200,
    'tasks - response time < 2s': (r) => r.timings.duration < 2000,
    'tasks - returns data array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.data);
      } catch {
        return false;
      }
    },
  });

  return response;
}

/**
 * Simulate user think time
 */
export function thinkTime(min = 0.5, max = 1.5) {
  sleep(Math.random() * (max - min) + min);
}
