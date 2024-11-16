package user

import (
	"context"
	"net/http"
)

type userService struct {
	url    string
	client *http.Client
}

func NewUserService(client *http.Client) *userService {
	return &userService{client: client}
}

func (a *userService) ExampleExternalSrv(ctx context.Context, token string) (string, error) {
	// example for calling external service
	// req := SubmitTransactionRequest{
	// 	TokenHash: token,
	// 	}
	// 	return httpclient.Post[SubmitTransactionRequest, GetUserByTokenResponse](ctx, a.client, a.url, req)
	return "ok", nil
}
