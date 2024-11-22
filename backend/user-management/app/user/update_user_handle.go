package user

import (
	"time"
	"user-management/app"
	"user-management/logger"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/google/uuid"
)

func (h *Handler) UpdateUser(c *gin.Context) {
	logger := logger.New()
	var req UpdateUserRequest
	if err := c.ShouldBindUri(&req); err != nil {
		app.ReturnBadRequest(c, err.Error())
		return
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		app.ReturnBadRequest(c, err.Error())
		return
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		app.ReturnBadRequest(c, err.Error())
		return
	}

	_, err := h.getUserFromStorage(c, req.UserId)
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

	updateUser := "ADMIN"
	now := time.Now()

	user := UserData{
		UserId:    uuid.MustParse(req.UserId),
		UserEmail: req.UserEmail,
		UserName:  req.UserName,
		UpdatedBy: &updateUser,
		UpdatedAt: &now,
	}

	if err := h.store.UpdateUser(c.Request.Context(), user); err != nil {
		app.ReturnInternalError(c, err.Error())
		return
	}

	if err := h.cache.Set(c.Request.Context(), user); err != nil {
		logger.Error("failed to set user to cache", "error", err, "userId", user.UserId.String())
		app.ReturnInternalError(c, "Failed to set user to cache: "+err.Error())
		return
	}

	app.ReturnSuccess(c, "updated user successfully")
}

type UpdateUserRequest struct {
	UserId    string `uri:"userId" validate:"required,uuid"`
	UserEmail string `json:"userEmail" validate:"required,email"`
	UserName  string `json:"userName" validate:"required"`
}
