package app

type Response struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

type ResponseCode int

const (
	CodeSuccess          ResponseCode = 0
	CodeFailedBadRequest ResponseCode = 1
	CodeFailedNotFound   ResponseCode = 2
	CodeFailedInternal   ResponseCode = 9
)
