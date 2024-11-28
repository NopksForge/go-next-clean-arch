package user

import (
	"user-management/app"

	"github.com/gin-gonic/gin"
)

func (h *Handler) DeleteUser(c *gin.Context) {
	var req DeleteUserRequest
	if err := c.ShouldBindUri(&req); err != nil {
		app.ReturnBadRequest(c, err.Error())
		return
	}

	user, err := h.getUserFromStorage(c, req.UserId)
	if err != nil {
		switch err.Error() {
		case app.ErrorDBNotFound:
			app.ReturnNotFound(c)
		case app.ErrorCache:
			app.ReturnInternalError(c, err.Error())
		default:
			app.ReturnInternalError(c, err.Error())
		}
		return
	}

	if err := h.cache.Delete(c.Request.Context(), user.UserId.String()); err != nil {
		app.ReturnInternalError(c, err.Error())
		return
	}

	if err := h.store.DeleteUser(c.Request.Context(), user.UserId.String()); err != nil {
		app.ReturnInternalError(c, err.Error())
		return
	}

	app.ReturnSuccess(c, "deleted user successfully")
}

type DeleteUserRequest struct {
	UserId string `uri:"userId" binding:"required,uuid"`
}
