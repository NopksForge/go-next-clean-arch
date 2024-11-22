package user

import (
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
			Code:    int(app.CodeFailedBadRequest),
			Message: err.Error(),
		})
		return
	}

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

	_, err := h.store.GetUserById(c.Request.Context(), req.UserId)
	if err != nil {
		if err.Error() == app.ErrorNotFound {
			c.JSON(http.StatusNotFound, app.Response{
				Code:    int(app.CodeFailedNotFound),
				Message: "User not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, app.Response{
			Code:    int(app.CodeFailedInternal),
			Message: err.Error(),
		})
		return
	}

	updateUser := "ADMIN"
	now := time.Now()

	if err := h.store.UpdateUser(c.Request.Context(), UserData{
		UserId:    uuid.MustParse(req.UserId),
		UserEmail: req.UserEmail,
		UserName:  req.UserName,
		UpdatedBy: &updateUser,
		UpdatedAt: &now,
	}); err != nil {

		c.JSON(http.StatusInternalServerError, app.Response{
			Code:    int(app.CodeFailedInternal),
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, app.Response{
		Code:    int(app.CodeSuccess),
		Message: "updated user successfully",
	})
}

type UpdateUserRequest struct {
	UserId    string `uri:"userId" validate:"required,uuid"`
	UserEmail string `json:"userEmail" validate:"required,email"`
	UserName  string `json:"userName" validate:"required"`
}
