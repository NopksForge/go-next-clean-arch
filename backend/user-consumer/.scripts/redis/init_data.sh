#!/bin/bash

# Waiting for Redis to be ready
echo "Waiting for Redis to start..."
while ! redis-cli -h redis ping; do
    sleep 1
    echo "Retrying..."
done

echo "Redis is up!"

redis-cli -h redis SET test_key 'test_value'