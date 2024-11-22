package user

import (
	"user-management/app"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
)

func (h *Handler) DeleteUser(c *gin.Context) {
	var req DeleteUserRequest
	if err := c.ShouldBindUri(&req); err != nil {
		app.ReturnBadRequest(c, err.Error())
		return
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		app.ReturnBadRequest(c, err.Error())
		return
	}

	if err := h.store.DeleteUser(c.Request.Context(), req.UserId); err != nil {
		app.ReturnInternalError(c, err.Error())
		return
	}

	app.ReturnSuccess(c, "deleted user successfully")
}

type DeleteUserRequest struct {
	UserId string `uri:"userId" validate:"required,uuid"`
}
