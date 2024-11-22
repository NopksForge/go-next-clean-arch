package user

import (
	"user-management/app"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetAllUser(c *gin.Context) {
	allUserData, err := h.store.GetAllUser(c.Request.Context())
	if err != nil {
		app.ReturnInternalError(c, err.Error())
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

	app.ReturnSuccess(c, responseData)
}

type Userdata struct {
	UserId    string `json:"userId"`
	UserEmail string `json:"userEmail"`
	UserName  string `json:"userName"`
}

type GetAllUserResponse []Userdata
