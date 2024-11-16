package user

import (
	"net/http"
	"user-management/app"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetUser(c *gin.Context) {
	var req GetUserRequest
	if err := c.ShouldBindUri(&req); err != nil {
		c.JSON(http.StatusBadRequest, app.Response{
			Message: err.Error(),
		})
		return
	}

	user, err := h.store.GetUserById(c.Request.Context(), req.UserId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, app.Response{
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, app.Response{
		Data: GetUserResponse{
			UserId:    user.UserId.String(),
			UserEmail: user.UserEmail,
			UserName:  user.UserName,
		},
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
