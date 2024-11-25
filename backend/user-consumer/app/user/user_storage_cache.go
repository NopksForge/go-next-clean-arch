package user

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"time"
	"user-consumer/app"

	"github.com/redis/go-redis/v9"
)

type storageCache struct {
	cache redis.UniversalClient
}

func NewStorageCache(cache redis.UniversalClient) *storageCache {
	return &storageCache{cache: cache}
}

func (s *storageCache) Set(ctx context.Context, user UserData) error {
	var buffer bytes.Buffer
	if err := json.NewEncoder(&buffer).Encode(user); err != nil {
		return err
	}

	if err := s.cache.Set(ctx, fmt.Sprintf("%v:%v", app.RedisUserKey, user.UserId.String()), buffer.String(), 10*time.Minute).Err(); err != nil {
		return err
	}

	return nil
}
