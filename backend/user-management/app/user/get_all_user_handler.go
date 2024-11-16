package user

import (
	"net/http"
	"user-management/app"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetAllUser(c *gin.Context) {
	allUserData, err := h.store.GetAllUser(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, app.Response{
			Message: err.Error(),
		})
		return
	}

	// Map database results to response structure
	responseData := make(GetAllUserResponse, len(allUserData))
	for i, user := range allUserData {
		responseData[i] = Userdata{
			UserId:    user.UserId.String(),
			UserEmail: user.UserEmail,
			UserName:  user.UserName,
		}
	}

	c.JSON(http.StatusOK, app.Response{
		Data: responseData,
	})
}

type Userdata struct {
	UserId    string `json:"userId"`
	UserEmail string `json:"userEmail"`
	UserName  string `json:"userName"`
}

type GetAllUserResponse []Userdata
