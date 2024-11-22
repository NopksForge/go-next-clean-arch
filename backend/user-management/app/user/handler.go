package user

import (
	"context"
)

type userByTokenService interface {
	ExampleExternalSrv(ctx context.Context, token string) (string, error)
}

type userStorage interface {
	CreateUser(ctx context.Context, data UserData) error
	GetAllUser(ctx context.Context) ([]UserData, error)
	GetUserById(ctx context.Context, id string) (*UserData, error)
	UpdateUser(ctx context.Context, data UserData) error
	DeleteUser(ctx context.Context, id string) error
}

type userStorageCache interface {
	Set(ctx context.Context, user UserData) error
	Get(ctx context.Context, id string) (*UserData, error)
	Delete(ctx context.Context, id string) error
}

type Handler struct {
	srv   userByTokenService
	store userStorage
	cache userStorageCache
}

func NewHandler(srv userByTokenService, store userStorage, cache userStorageCache) *Handler {
	return &Handler{srv: srv, store: store, cache: cache}
}
