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

	if err := h.store.DeleteUser(c.Request.Context(), req.UserId); err != nil {
		c.JSON(http.StatusInternalServerError, app.Response{
			Code:    int(app.CodeFailedInternal),
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, app.Response{
		Code:    int(app.CodeSuccess),
		Message: "deleted user successfully",
	})
}

type DeleteUserRequest struct {
	UserId string `uri:"userId" validate:"required,uuid"`
}
