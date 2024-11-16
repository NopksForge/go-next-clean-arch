package user

import (
	"net/http"
	"user-management/app"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
)

func (h *Handler) DeleteUser(c *gin.Context) {
	var req DeleteUserRequest
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

	if err := h.store.DeleteUser(c.Request.Context(), req.UserId); err != nil {
		c.JSON(http.StatusInternalServerError, app.Response{
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, app.Response{
		Message: "deleted user successfully",
	})
}

type DeleteUserRequest struct {
	UserId string `uri:"userId" validate:"required,uuid"`
}
