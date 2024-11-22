package user

import (
	"net/http"
	"time"
	"user-management/app"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/google/uuid"
)

func (h *Handler) CreateUser(c *gin.Context) {
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

	if err := h.store.CreateUser(c.Request.Context(), UserData{
		UserId:    userId,
		UserName:  req.UserName,
		UserEmail: req.UserEmail,
		CreatedBy: "ADMIN",
		CreatedAt: time.Now(),
	}); err != nil {
		c.JSON(http.StatusInternalServerError, app.Response{
			Code:    int(app.CodeFailedInternal),
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, app.Response{
		Code: int(app.CodeSuccess),
		Data: CreateUserResponse{
			UserId:    userId,
			UserEmail: req.UserEmail,
			UserName:  req.UserName,
			Msg:       "submitted user successfully",
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
	Msg       string
}
