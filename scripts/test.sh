#!/bin/bash

cd backend
go test ./calculator -v

cd ../frontend
pnpm test