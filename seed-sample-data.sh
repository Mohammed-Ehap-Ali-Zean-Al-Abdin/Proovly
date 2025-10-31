#!/bin/bash
set -e

API="http://localhost:4000/api/v1"

echo "🌱 Seeding sample data"
echo "======================"

# Start backend if not running
if ! nc -z localhost 4000 >/dev/null 2>&1; then
  echo "Starting backend..."
  cd "$(dirname "$0")/backend"
  npm run dev >/dev/null 2>&1 &
  BACKEND_PID=$!
  sleep 3
  cd - >/dev/null
else
  echo "Backend already running"
fi

# Create users
echo "Creating users..."
DONOR_SIGNUP=$(curl -s -X POST "$API/auth/signup" -H 'Content-Type: application/json' -d '{"name":"Donor One","email":"donor1@example.com","password":"secret123","role":"donor"}')
NGO_SIGNUP=$(curl -s -X POST "$API/auth/signup" -H 'Content-Type: application/json' -d '{"name":"NGO One","email":"ngo1@example.com","password":"secret123","role":"ngo"}')
ADMIN_SIGNUP=$(curl -s -X POST "$API/auth/signup" -H 'Content-Type: application/json' -d '{"name":"Admin One","email":"admin1@example.com","password":"secret123","role":"admin"}')

DONOR_ID=$(echo "$DONOR_SIGNUP" | jq -r '.user.id')
NGO_ID=$(echo "$NGO_SIGNUP" | jq -r '.user.id')
ADMIN_ID=$(echo "$ADMIN_SIGNUP" | jq -r '.user.id')

if [ -z "$DONOR_ID" ] || [ "$DONOR_ID" = "null" ]; then
  echo "Failed to create donor user" && exit 1
fi

# Create donations
echo "Creating donations..."
D1=$(curl -s -X POST "$API/donations" -H 'Content-Type: application/json' -d '{"donorId":"'"$DONOR_ID"'","campaignId":"cmp-1","amountUSD":50}')
D2=$(curl -s -X POST "$API/donations" -H 'Content-Type: application/json' -d '{"donorId":"'"$DONOR_ID"'","campaignId":"cmp-2","amountUSD":120}')

# List donations
echo "Listing donations..."
LIST=$(curl -s "$API/donations?userId=$DONOR_ID")
COUNT=$(echo "$LIST" | jq 'length')

echo ""
echo "✅ Seed complete"
echo "Donor ID: $DONOR_ID"
echo "NGO ID:   $NGO_ID"
echo "Admin ID: $ADMIN_ID"
echo "Donations created: $COUNT"

# Stop backend if we started it
if [ -n "$BACKEND_PID" ]; then
  echo "Stopping backend..."
  kill $BACKEND_PID 2>/dev/null || true
fi
