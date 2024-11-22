package user

import (
	"user-management/app"
	"user-management/logger"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func (h *Handler) GetUser(c *gin.Context) {
	logger := logger.New()
	var req GetUserRequest
	if err := c.ShouldBindUri(&req); err != nil {
		app.ReturnBadRequest(c, err.Error())
		return
	}

	// Try getting from cache first
	user, err := h.cache.Get(c.Request.Context(), req.UserId)
	if err != nil {
		// If cache error is redis.Nil (key not found), proceed to database
		if err == redis.Nil {
			user, err = h.store.GetUserById(c.Request.Context(), req.UserId)
			if err != nil {
				switch err.Error() {
				case app.ErrorNotFound:
					app.ReturnNotFound(c, "User not found")
					return
				default:
					app.ReturnInternalError(c, "Failed to retrieve user from database: "+err.Error())
					return
				}
			}
			logger.Info("get user from database", "userId", req.UserId)

			// Add to cache after successful DB retrieval
			if err := h.cache.Set(c.Request.Context(), *user); err != nil {
				logger.Error("failed to set user to cache", "error", err, "userId", req.UserId)
			}
		} else {
			// For any other cache error, return internal server error
			app.ReturnInternalError(c, "Failed to retrieve user from cache: "+err.Error())
			return
		}
	} else {
		logger.Info("get user from cache", "userId", req.UserId)
	}

	app.ReturnSuccess(c, GetUserResponse{
		UserId:    user.UserId.String(),
		UserEmail: user.UserEmail,
		UserName:  user.UserName,
	})
}

type GetUserRequest struct {
	UserId string `uri:"userId" validate:"required,uuid"`
}

type GetUserResponse struct {
	UserId    string `json:"userId"`
	UserEmail string `json:"userEmail"`
	UserName  string `json:"userName"`
}
