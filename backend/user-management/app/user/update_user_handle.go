package user

import (
	"time"
	"user-management/app"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/google/uuid"
)

func (h *Handler) UpdateUser(c *gin.Context) {
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

	_, err := h.store.GetUserById(c.Request.Context(), req.UserId)
	if err != nil {
		if err.Error() == app.ErrorDBNotFound {
			app.ReturnNotFound(c)
			return
		}
		app.ReturnInternalError(c, "Failed to retrieve user from database: "+err.Error())
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
		app.ReturnInternalError(c, err.Error())
		return
	}

	app.ReturnSuccess(c, "updated user successfully")
}

type UpdateUserRequest struct {
	UserId    string `uri:"userId" validate:"required,uuid"`
	UserEmail string `json:"userEmail" validate:"required,email"`
	UserName  string `json:"userName" validate:"required"`
}
