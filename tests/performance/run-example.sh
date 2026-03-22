#!/bin/bash
# Example: Run k6 performance tests for Task Manager API
# Ensure the backend is running: cd backend && npm run start:dev

export BASE_URL=http://localhost:3000

echo "Running smoke test..."
k6 run smoke/smoke.js

# Uncomment to run other tests:
# k6 run baseline/baseline.js
# k6 run load/load.js
# k6 run stress/stress.js
# k6 run spike/spike.js
# k6 run breakpoint/breakpoint.js
# k6 run soak/soak.js
# ./run.sh all
