package user

import (
	"encoding/json"
	"user-management/app"
	"user-management/logger"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/google/uuid"
)

func (h *Handler) CreateUser(c *gin.Context) {
	logger := logger.New()
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		app.ReturnBadRequest(c, err.Error())
		return
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		app.ReturnBadRequest(c, err.Error())
		return
	}

	userId := uuid.Must(uuid.NewV7())
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
	UserEmail     string `json:"userEmail" validate:"required,email"`
	UserFirstName string `json:"userFirstName" validate:"required"`
	UserLastName  string `json:"userLastName" validate:"required"`
	UserPhone     string `json:"userPhone" validate:"required"`
	UserRole      string `json:"userRole" validate:"required"`
	IsActive      *bool  `json:"isActive" validate:"required"`
}

type CreateUserResponse struct {
	UserId        uuid.UUID
	UserEmail     string
	UserFirstName string
	UserLastName  string
}
