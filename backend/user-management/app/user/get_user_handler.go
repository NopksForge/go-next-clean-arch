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
			Code:    int(app.CodeFailedBadRequest),
			Message: err.Error(),
		})
		return
	}

	user, err := h.store.GetUserById(c.Request.Context(), req.UserId)
	if err != nil {
		if err.Error() == app.ErrorNotFound {
			c.JSON(http.StatusNotFound, app.Response{
				Code:    int(app.CodeFailedNotFound),
				Message: "User not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, app.Response{
			Code:    int(app.CodeFailedInternal),
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, app.Response{
		Code: int(app.CodeSuccess),
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
