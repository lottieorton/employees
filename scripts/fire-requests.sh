#!/usr/bin/env bash

BASE_URL="http://localhost:8080/employees"
NUM_REQUESTS=30
LOG_FILE="request-results.log"

> "$LOG_FILE"

echo "Firing $NUM_REQUESTS concurrent requests"

for i in $(seq 1 "$NUM_REQUESTS"); do
    (
        if(( i % 3 == 0 )); then
            status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL?search=sarah")
            echo "Request $i -> employees?search=sarah -> HTTP $status" >> "$LOG_FILE"
        else 
            employee_id=$((RANDOM % 10))
            status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$employee_id")
            echo "Request $i -> employees/$employee_id -> HTTP $status" >> "$LOG_FILE"
        fi
    ) &
done

wait
echo "Done"
cat "$LOG_FILE"

success_count=$(grep -c "HTTP 200" "$LOG_FILE")
not_found_count=$(grep -c "HTTP 404" "$LOG_FILE")
error_count=$(grep -c "HTTP 500" "$LOG_FILE");

echo "-----------------------------------"
echo "Summary:"
echo "  Success (200): $success_count"
echo "  Not Found (404): $not_found_count"
echo "  Server Errors (500): $error_count"
echo "-----------------------------------"