package user

import (
	"time"
	"user-management/app"
	"user-management/logger"
	"user-management/serror"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func (h *Handler) GetUser(c *gin.Context) {
	var req GetUserRequest
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

	app.ReturnSuccess(c, GetUserResponse{
		UserId:        user.UserId.String(),
		UserEmail:     user.UserEmail,
		UserFirstName: user.UserFirstName,
		UserLastName:  user.UserLastName,
		UserPhone:     user.UserPhone,
		UserRole:      user.UserRole,
		IsActive:      user.IsActive,
	})
}

func (h *Handler) getUserFromStorage(c *gin.Context, userId string) (*UserData, error) {
	logger := logger.New()

	// Try getting from cache first
	user, err := h.cache.Get(c.Request.Context(), userId)
	if err != nil {
		// If cache error is redis.Nil (key not found), proceed to database
		if err == redis.Nil {
			user, err = h.store.GetUserById(c.Request.Context(), userId)
			if err != nil {
				return nil, serror.New(app.ErrorInternal)
			}
			logger.Info("get user from database", "userId", userId)

			// Add to cache after successful DB retrieval
			if err := h.cache.Set(c.Request.Context(), *user); err != nil {
				logger.Error("failed to set user to cache", "error", err, "userId", userId)
				return nil, serror.New(app.ErrorCache)
			}
			return user, nil
		}
		// For any other cache error, return the error
		return nil, serror.New(app.ErrorCache)
	}

	logger.Info("get user from cache", "userId", userId)
	return user, nil
}

type GetUserRequest struct {
	UserId string `uri:"userId" binding:"required,uuid"`
}

type GetUserResponse struct {
	UserId        string    `json:"userId"`
	UserEmail     string    `json:"userEmail"`
	UserFirstName string    `json:"userFirstName"`
	UserLastName  string    `json:"userLastName"`
	UserPhone     string    `json:"userPhone"`
	UserRole      string    `json:"userRole"`
	UpdatedAt     time.Time `json:"updatedAt"`
	IsActive      bool      `json:"isActive"`
}
