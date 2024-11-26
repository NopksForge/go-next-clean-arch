package user

import (
	"time"
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
			UserId:        user.UserId.String(),
			UserEmail:     user.UserEmail,
			UserFirstName: user.UserFirstName,
			UserLastName:  user.UserLastName,
			UserPhone:     user.UserPhone,
			UserRole:      user.UserRole,
			UpdatedAt:     *user.UpdatedAt,
			IsActive:      user.IsActive,
		}
	}

	app.ReturnSuccess(c, responseData)
}

type Userdata struct {
	UserId        string    `json:"userId"`
	UserEmail     string    `json:"userEmail"`
	UserFirstName string    `json:"userFirstName"`
	UserLastName  string    `json:"userLastName"`
	UserPhone     string    `json:"userPhone"`
	UserRole      string    `json:"userRole"`
	UpdatedAt     time.Time `json:"updatedAt"`
	IsActive      bool      `json:"isActive"`
}

type GetAllUserResponse []Userdata
