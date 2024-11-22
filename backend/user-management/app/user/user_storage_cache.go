package user

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"time"
	"user-management/app"

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

func (s *storageCache) Get(ctx context.Context, id string) (*UserData, error) {
	byteResult, err := s.cache.Get(ctx, fmt.Sprintf("%v:%v", app.RedisUserKey, id)).Bytes()
	if err != nil {
		return nil, err
	}

	var user UserData
	if err := json.NewDecoder(bytes.NewReader(byteResult)).Decode(&user); err != nil {
		return nil, err
	}

	return &user, nil
}
