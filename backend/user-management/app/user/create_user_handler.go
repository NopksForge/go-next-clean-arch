package user

import (
	"encoding/json"
	"user-management/app"
	"user-management/logger"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *Handler) CreateUser(c *gin.Context) {
	logger := logger.New()
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		app.ReturnBadRequest(c, err.Error())
		return
	}

	userId, err := uuid.NewV7()
	if err != nil {
		logger.Error("failed to generate UUID", "error", err)
		app.ReturnInternalError(c, "failed to generate user ID")
		return
	}
	user := UserData{
		UserId:        userId,
		UserFirstName: req.UserFirstName,
		UserLastName:  req.UserLastName,
		UserPhone:     req.UserPhone,
		UserRole:      req.UserRole,
		UserEmail:     req.UserEmail,
		IsActive:      *req.IsActive,
	}

	userBytes, err := json.Marshal(user)
	if err != nil {
		app.ReturnInternalError(c, err.Error())
		return
	}

	if err := h.kafka.ProduceUserCreation(c.Request.Context(), userBytes); err != nil {
		logger.Error("failed to produce user creation", "error", err)
		app.ReturnInternalError(c, err.Error())
		return
	}

	app.ReturnSuccess(c, CreateUserResponse{
		UserId:        userId,
		UserEmail:     req.UserEmail,
		UserFirstName: req.UserFirstName,
		UserLastName:  req.UserLastName,
	})
}

type CreateUserRequest struct {
	UserEmail     string `json:"userEmail" binding:"required,email"`
	UserFirstName string `json:"userFirstName" binding:"required"`
	UserLastName  string `json:"userLastName" binding:"required"`
	UserPhone     string `json:"userPhone" binding:"required,len=10"`
	UserRole      string `json:"userRole" binding:"required"`
	IsActive      *bool  `json:"isActive" binding:"required"`
}

type CreateUserResponse struct {
	UserId        uuid.UUID
	UserEmail     string
	UserFirstName string
	UserLastName  string
}
