#!/bin/bash

echo "🧪 Quick Integration Test"
echo "=========================="
echo ""

# Start backend in background
echo "Starting backend..."
cd /Users/mesh/Projects/Web/Proovly/backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Test endpoints
echo ""
echo "Testing endpoints..."
echo ""

echo "1. Backend health:"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:4000/api/v1/health
echo ""

echo "2. Auth endpoint:"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:4000/api/v1/auth/login
echo ""

echo "3. Donations endpoint:"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:4000/api/v1/donations
echo ""

echo "4. Analytics endpoint:"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:4000/api/v1/analytics/summary
echo ""

# Kill backend
echo ""
echo "Stopping backend..."
kill $BACKEND_PID 2>/dev/null

echo ""
echo "✅ Test complete!"
