#!/bin/bash
BASE_URL="http://127.0.0.1:8787"

echo "Testing public links..."
for path in /post-quantum /owasp-range /hybrid-warroom /ai-gateway-arena \
            /stormcenter /troubletoolbox /traps-lab /threat-modeler \
            /multicloud-sim /attack-patterns; do
  echo -n "Testing $path: "
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")
  echo "$STATUS"
done

echo "\nTesting protected links (should be 401)..."
for path in /sales-portal /sase-compare /ztna-compare; do
  echo -n "Testing $path: "
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")
  echo "$STATUS"
done

echo "\nTesting API endpoints..."
curl -s "$BASE_URL/message" | grep -q "Hello" && echo "✅ /message" || echo "❌ /message"
curl -s "$BASE_URL/get-ticker" | grep -q "CVE" && echo "✅ /get-ticker" || echo "❌ /get-ticker"

echo "\nTesting images..."
curl -s -I "$BASE_URL/images/sellerrco.png" | grep -q "200 OK" && echo "✅ Logo" || echo "❌ Logo"
curl -s -I "$BASE_URL/images/mainpage.png" | grep -q "200 OK" && echo "✅ Hero" || echo "❌ Hero"

echo "\nAll tests complete!"