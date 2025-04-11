package calculator

import (
	"context"
	"errors"

	"connectrpc.com/connect"
	calculatorv1 "github.com/uiyzzi/calculator_demo/backend/gen"
)

type Server struct{}

func (s *Server) Add(
	ctx context.Context,
	req *connect.Request[calculatorv1.OperationRequest],
) (*connect.Response[calculatorv1.OperationResponse], error) {
	result := req.Msg.GetLeft() + req.Msg.GetRight()
	return connect.NewResponse(&calculatorv1.OperationResponse{Result: result}), nil
}

func (s *Server) Subtract(
	ctx context.Context,
	req *connect.Request[calculatorv1.OperationRequest],
) (*connect.Response[calculatorv1.OperationResponse], error) {
	result := req.Msg.GetLeft() - req.Msg.GetRight()
	return connect.NewResponse(&calculatorv1.OperationResponse{Result: result}), nil
}

func (s *Server) Multiply(
	ctx context.Context,
	req *connect.Request[calculatorv1.OperationRequest],
) (*connect.Response[calculatorv1.OperationResponse], error) {
	result := req.Msg.GetLeft() * req.Msg.GetRight()
	return connect.NewResponse(&calculatorv1.OperationResponse{Result: result}), nil
}

func (s *Server) Divide(
	ctx context.Context,
	req *connect.Request[calculatorv1.OperationRequest],
) (*connect.Response[calculatorv1.OperationResponse], error) {
	if req.Msg.GetRight() == 0 {
		return nil, connect.NewError(connect.CodeInvalidArgument, errors.New("除数不能为0"))
	}
	result := req.Msg.GetLeft() / req.Msg.GetRight()
	return connect.NewResponse(&calculatorv1.OperationResponse{Result: result}), nil
}
