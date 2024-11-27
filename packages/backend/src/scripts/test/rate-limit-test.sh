// ./scripts/test/rate-limit-test.sh

#!/bin/bash

# Function to make API request
make_request() {
    curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/analyze/url \
        -H "Content-Type: application/json" \
        -d '{
            "url": "https://example.com",
            "type": "accessibility",
            "projectId": "test-project-3"
        }'
}

# Make 102 requests (should hit rate limit after 100)
for i in {1..102}; do
    echo "Request $i:"
    response=$(make_request)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    echo "Status Code: $http_code"
    echo "Response: $body"
    echo "-------------------"
    
    # If we get a 429 (Too Many Requests), break
    if [ "$http_code" -eq 429 ]; then
        echo "Rate limit hit after $i requests"
        break
    fi
done