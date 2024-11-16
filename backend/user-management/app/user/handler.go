package user

import (
	"context"
)

type userByTokenService interface {
	ExampleExternalSrv(ctx context.Context, token string) (string, error)
}

type userStorage interface {
	CreateUser(ctx context.Context, data UserDataPG) error
	GetAllUser(ctx context.Context) ([]UserDataPG, error)
	GetUserById(ctx context.Context, id string) (UserDataPG, error)
	UpdateUser(ctx context.Context, data UserDataPG) error
	DeleteUser(ctx context.Context, id string) error
}

type Handler struct {
	srv   userByTokenService
	store userStorage
}

func NewHandler(srv userByTokenService, store userStorage) *Handler {
	return &Handler{srv: srv, store: store}
}
