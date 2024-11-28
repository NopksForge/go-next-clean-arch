package user

import (
	"time"
	"user-management/app"
	"user-management/logger"

	"github.com/gin-gonic/gin"
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

	now := time.Now()

	user := UserData{
		UserId:        uuid.MustParse(req.UserId),
		UserEmail:     req.UserEmail,
		UserFirstName: req.UserFirstName,
		UserLastName:  req.UserLastName,
		UserPhone:     req.UserPhone,
		UserRole:      req.UserRole,
		UpdatedAt:     &now,
		IsActive:      *req.IsActive,
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
	UserId        string `uri:"userId" binding:"required,uuid"`
	UserEmail     string `json:"userEmail" binding:"required,email"`
	UserFirstName string `json:"userFirstName" binding:"required"`
	UserLastName  string `json:"userLastName" binding:"required"`
	UserPhone     string `json:"userPhone" binding:"required,len=10"`
	UserRole      string `json:"userRole" binding:"required"`
	IsActive      *bool  `json:"isActive" binding:"required"`
}
