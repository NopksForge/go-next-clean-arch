package user

import (
	"net/http"
	"time"
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
		c.JSON(http.StatusBadRequest, app.Response{
			Code:    int(app.CodeFailedBadRequest),
			Message: err.Error(),
		})
		return
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		c.JSON(http.StatusBadRequest, app.Response{
			Code:    int(app.CodeFailedBadRequest),
			Message: err.Error(),
		})
		return
	}

	userId := uuid.Must(uuid.NewV7())
	user := UserData{
		UserId:    userId,
		UserName:  req.UserName,
		UserEmail: req.UserEmail,
		CreatedBy: "ADMIN",
		CreatedAt: time.Now(),
	}

	if err := h.store.CreateUser(c.Request.Context(), user); err != nil {
		c.JSON(http.StatusInternalServerError, app.Response{
			Code:    int(app.CodeFailedInternal),
			Message: err.Error(),
		})
		return
	}

	if err := h.cache.Set(c.Request.Context(), user); err != nil {
		logger.Error("failed to set user to cache", "error", err, "userId", userId)
		c.JSON(http.StatusInternalServerError, app.Response{
			Code:    int(app.CodeFailedInternal),
			Message: "Failed to set user to cache: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, app.Response{
		Code: int(app.CodeSuccess),
		Data: CreateUserResponse{
			UserId:    userId,
			UserEmail: req.UserEmail,
			UserName:  req.UserName,
		},
	})
}

type CreateUserRequest struct {
	UserEmail string `json:"userEmail" validate:"required,email"`
	UserName  string `json:"userName" validate:"required"`
}

type CreateUserResponse struct {
	UserId    uuid.UUID
	UserEmail string
	UserName  string
}
