package user

import (
	"database/sql"
	"errors"
	"net/http"
	"time"
	"user-management/app"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/google/uuid"
)

func (h *Handler) UpdateUser(c *gin.Context) {
	var req UpdateUserRequest
	if err := c.ShouldBindUri(&req); err != nil {
		c.JSON(http.StatusBadRequest, app.Response{
			Message: err.Error(),
		})
		return
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		c.JSON(http.StatusBadRequest, app.Response{
			Message: err.Error(),
		})
		return
	}

	user := "ADMIN"
	now := time.Now()

	if err := h.store.UpdateUser(c.Request.Context(), UserDataPG{
		UserId:    uuid.MustParse(req.UserId),
		UserEmail: req.UserEmail,
		UserName:  req.UserName,
		UpdatedBy: &user,
		UpdatedAt: &now,
	}); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, app.Response{Message: err.Error()})
			return
		}

		c.JSON(http.StatusInternalServerError, app.Response{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, app.Response{
		Message: "updated user successfully",
	})
}

type UpdateUserRequest struct {
	UserId    string `uri:"userId" validate:"required,uuid"`
	UserEmail string `json:"userEmail" validate:"required,email"`
	UserName  string `json:"userName" validate:"required"`
}
