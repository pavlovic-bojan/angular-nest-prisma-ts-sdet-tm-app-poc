/**
 * Authentication Module for k6 - Task Manager API
 * Provides JWT login and auth header helpers.
 */

import http from 'k6/http';
import { getConfig } from './config.js';

/**
 * Login and return the JWT access token.
 * Call this from setup() and pass the token to API functions.
 * @returns {string} JWT access_token
 */
export function login() {
  const config = getConfig();
  const url = `${config.baseUrl}${config.endpoints.login}`;
  const res = http.post(url, JSON.stringify(config.loginPayload), { headers: config.headers });

  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`Setup: login failed with status ${res.status} — ${res.body}`);
  }

  const body = JSON.parse(res.body);
  if (!body.access_token) {
    throw new Error('Setup: login response missing access_token');
  }

  return body.access_token;
}

/**
 * Build request params including the Bearer auth header.
 * @param {string} token - JWT access token from login()
 * @param {Object} additionalHeaders - Extra headers to merge
 * @returns {Object} k6 request params
 */
export function getRequestParams(token, additionalHeaders = {}) {
  const config = getConfig();
  return {
    headers: {
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...additionalHeaders,
    },
    tags: { name: 'TM_API' },
  };
}
