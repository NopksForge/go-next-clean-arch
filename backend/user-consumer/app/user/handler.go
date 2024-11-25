package user

import (
	"context"
	"encoding/json"

	"user-consumer/logger"

	"github.com/IBM/sarama"
)

type userStorage interface {
	CreateUser(ctx context.Context, data UserData) error
}

type userStorageCache interface {
	Set(ctx context.Context, user UserData) error
}

type Handler struct {
	store userStorage
	cache userStorageCache
}

func NewHandler(store userStorage, cache userStorageCache) *Handler {
	return &Handler{store: store, cache: cache}
}

func (h *Handler) ConsumeUserCreation(ctx context.Context, msg *sarama.ConsumerMessage) {
	logger := logger.New()

	var data UserData
	if err := json.Unmarshal(msg.Value, &data); err != nil {
		logger.Error("failed to unmarshal message", "error", err)
		return
	}

	if err := h.store.CreateUser(ctx, data); err != nil {
		logger.Error("failed to create user", "error", err)
		return
	}

	if err := h.cache.Set(ctx, data); err != nil {
		logger.Error("failed to set user to cache", "error", err)
	}
	logger.Info("user created", "data", data)
}
