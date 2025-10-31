#!/bin/bash

# Proovly Frontend-Backend Integration Test Script
# This script helps verify the frontend-backend connection

echo "🚀 Proovly Integration Test"
echo "============================"
echo ""

# Check if backend is running
echo "1️⃣  Checking backend..."
BACKEND_HEALTH=$(curl -s http://localhost:4000/healthz 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Backend is running on http://localhost:4000"
    echo "   Response: $BACKEND_HEALTH"
else
    echo "❌ Backend is NOT running"
    echo "   Start it with: cd backend && npm run dev"
    exit 1
fi

echo ""

# Check if frontend is running
echo "2️⃣  Checking frontend..."
FRONTEND_CHECK=$(curl -s http://localhost:3000 2>/dev/null | head -n 1)
if [ $? -eq 0 ]; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "❌ Frontend is NOT running"
    echo "   Start it with: cd proovly-app && npm run dev"
    exit 1
fi

echo ""

# Test API endpoints
echo "3️⃣  Testing API endpoints..."

# Test auth signup (expect 400 for missing fields)
echo -n "   📝 Auth signup endpoint... "
SIGNUP_TEST=$(curl -s -X POST http://localhost:4000/api/v1/auth/signup \
    -H "Content-Type: application/json" \
    -d '{}' \
    -w "%{http_code}" -o /dev/null)
if [ "$SIGNUP_TEST" = "400" ]; then
    echo "✅ (responds correctly to invalid data)"
else
    echo "⚠️  (got $SIGNUP_TEST, expected 400)"
fi

# Test donations endpoint (expect 401 for no auth)
echo -n "   📊 Donations endpoint... "
DONATIONS_TEST=$(curl -s http://localhost:4000/api/v1/donations \
    -w "%{http_code}" -o /dev/null)
if [ "$DONATIONS_TEST" = "401" ] || [ "$DONATIONS_TEST" = "200" ]; then
    echo "✅ (endpoint accessible)"
else
    echo "⚠️  (got $DONATIONS_TEST)"
fi

# Test analytics endpoint
echo -n "   📈 Analytics endpoint... "
ANALYTICS_TEST=$(curl -s "http://localhost:4000/api/v1/analytics/summary" \
    -w "%{http_code}" -o /dev/null)
if [ "$ANALYTICS_TEST" = "200" ]; then
    echo "✅ (returns data)"
else
    echo "⚠️  (got $ANALYTICS_TEST, expected 200)"
fi

echo ""
echo "4️⃣  Environment check..."

# Check .env.local
if [ -f "proovly-app/.env.local" ]; then
    echo "✅ .env.local exists"
    if grep -q "NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1" proovly-app/.env.local; then
        echo "✅ API URL is correctly configured"
    else
        echo "⚠️  API URL might not be set correctly"
    fi
else
    echo "❌ .env.local NOT found"
    echo "   Copy it: cp proovly-app/.env.example proovly-app/.env.local"
fi

echo ""
echo "============================"
echo "✅ Integration test complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Try signing up with a new account"
echo "   3. Login and check the donations page"
echo "   4. View API docs at http://localhost:4000/api-docs"
echo ""
echo "🐛 If you encounter issues:"
echo "   - Check browser console for errors"
echo "   - Check backend terminal for request logs"
echo "   - Verify MongoDB connection in backend"
echo ""
