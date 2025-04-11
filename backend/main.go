package main

import (
	"log"
	"net/http"

	"github.com/uiyzzi/calculator_demo/backend/calculator"
	"github.com/uiyzzi/calculator_demo/backend/gen/genconnect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

func main() {
	calcServer := &calculator.Server{}
	mux := http.NewServeMux()
	path, handler := genconnect.NewCalculatorHandler(calcServer)
	mux.Handle(path, handler)

	log.Println("server listening on :8080")
	http.ListenAndServe(
		":8080",
		h2c.NewHandler(mux, &http2.Server{}),
	)
}
