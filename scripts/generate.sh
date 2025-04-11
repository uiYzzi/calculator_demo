#!/bin/bash

PROTO_DIR="./proto"
GO_OUT_DIR="./backend/gen"
TS_OUT_DIR="./frontend/src/gen"

rm -rf $GO_OUT_DIR
rm -rf $TS_OUT_DIR

mkdir -p $GO_OUT_DIR
mkdir -p $TS_OUT_DIR

protoc -I=$PROTO_DIR --go_out=$GO_OUT_DIR --go_opt=paths=source_relative \
       --connect-go_out=$GO_OUT_DIR --connect-go_opt=paths=source_relative \
       $PROTO_DIR/calculator.proto

protoc -I=$PROTO_DIR --plugin=protoc-gen-es=./frontend/node_modules/.bin/protoc-gen-es \
       --es_out=$TS_OUT_DIR \
       $PROTO_DIR/calculator.proto
