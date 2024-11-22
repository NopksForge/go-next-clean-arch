package app

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

type ResponseCode int

const (
	CodeSuccess          ResponseCode = 0
	CodeFailedBadRequest ResponseCode = 1001
	CodeFailedNotFound   ResponseCode = 4004
	CodeFailedInternal   ResponseCode = 9999
)

func ReturnSuccess(c *gin.Context, data any) {
	c.JSON(http.StatusOK, Response{
		Code:    int(CodeSuccess),
		Message: "success",
		Data:    data,
	})
}

func ReturnBadRequest(c *gin.Context, message string) {
	c.JSON(http.StatusBadRequest, Response{
		Code:    int(CodeFailedBadRequest),
		Message: message,
	})
}

func ReturnNotFound(c *gin.Context, message string) {
	c.JSON(http.StatusNotFound, Response{
		Code:    int(CodeFailedNotFound),
		Message: message,
	})
}

func ReturnInternalError(c *gin.Context, message string) {
	c.JSON(http.StatusInternalServerError, Response{
		Code:    int(CodeFailedInternal),
		Message: message,
	})
}
