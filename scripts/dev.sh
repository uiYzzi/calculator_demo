#!/bin/bash

cleanup() {
    echo "正在停止所有进程..."
    kill -TERM $backend_pid $frontend_pid 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

cd backend
go run main.go &
backend_pid=$!

cd ../frontend
pnpm run dev &
frontend_pid=$!

while true; do
    sleep 1
    if ! kill -0 $backend_pid 2>/dev/null || ! kill -0 $frontend_pid 2>/dev/null; then
        cleanup
    fi
done