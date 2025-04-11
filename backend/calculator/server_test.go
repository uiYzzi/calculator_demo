package calculator

import (
	"context"
	"testing"

	"connectrpc.com/connect"
	"github.com/google/go-cmp/cmp"
	calculatorv1 "github.com/uiyzzi/calculator_demo/backend/gen"
)

func TestServer_Add(t *testing.T) {
	server := &Server{}
	ctx := context.Background()

	tests := []struct {
		name     string
		left     float64
		right    float64
		expected float64
	}{
		{"正数相加", 1.0, 2.0, 3.0},
		{"负数相加", -1.0, -2.0, -3.0},
		{"零相加", 0.0, 0.0, 0.0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := connect.NewRequest(&calculatorv1.OperationRequest{
				Left:  tt.left,
				Right: tt.right,
			})
			resp, err := server.Add(ctx, req)
			if err != nil {
				t.Fatalf("Add() error = %v", err)
			}
			if diff := cmp.Diff(resp.Msg.Result, tt.expected); diff != "" {
				t.Errorf("Add() mismatch (-want +got):\n%s", diff)
			}
		})
	}
}

func TestServer_Subtract(t *testing.T) {
	server := &Server{}
	ctx := context.Background()

	tests := []struct {
		name     string
		left     float64
		right    float64
		expected float64
	}{
		{"正数相减", 3.0, 2.0, 1.0},
		{"负数相减", -1.0, -2.0, 1.0},
		{"零相减", 0.0, 0.0, 0.0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := connect.NewRequest(&calculatorv1.OperationRequest{
				Left:  tt.left,
				Right: tt.right,
			})
			resp, err := server.Subtract(ctx, req)
			if err != nil {
				t.Fatalf("Subtract() error = %v", err)
			}
			if diff := cmp.Diff(resp.Msg.Result, tt.expected); diff != "" {
				t.Errorf("Subtract() mismatch (-want +got):\n%s", diff)
			}
		})
	}
}

func TestServer_Multiply(t *testing.T) {
	server := &Server{}
	ctx := context.Background()

	tests := []struct {
		name     string
		left     float64
		right    float64
		expected float64
	}{
		{"正数相乘", 2.0, 3.0, 6.0},
		{"负数相乘", -2.0, 3.0, -6.0},
		{"零相乘", 0.0, 5.0, 0.0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := connect.NewRequest(&calculatorv1.OperationRequest{
				Left:  tt.left,
				Right: tt.right,
			})
			resp, err := server.Multiply(ctx, req)
			if err != nil {
				t.Fatalf("Multiply() error = %v", err)
			}
			if diff := cmp.Diff(resp.Msg.Result, tt.expected); diff != "" {
				t.Errorf("Multiply() mismatch (-want +got):\n%s", diff)
			}
		})
	}
}

func TestServer_Divide(t *testing.T) {
	server := &Server{}
	ctx := context.Background()

	tests := []struct {
		name     string
		left     float64
		right    float64
		expected float64
		wantErr  bool
	}{
		{"正常除法", 6.0, 2.0, 3.0, false},
		{"负数除法", -6.0, 2.0, -3.0, false},
		{"除数为零", 6.0, 0.0, 0.0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := connect.NewRequest(&calculatorv1.OperationRequest{
				Left:  tt.left,
				Right: tt.right,
			})
			resp, err := server.Divide(ctx, req)
			if tt.wantErr {
				if err == nil {
					t.Error("Divide() expected error but got none")
				}
				return
			}
			if err != nil {
				t.Fatalf("Divide() error = %v", err)
			}
			if diff := cmp.Diff(resp.Msg.Result, tt.expected); diff != "" {
				t.Errorf("Divide() mismatch (-want +got):\n%s", diff)
			}
		})
	}
}
