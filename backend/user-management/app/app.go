package app

type ctxKey string

const (
	refIDKey      ctxKey = "ref-id"
	forwardCtxKey ctxKey = "forwarding"
	RedisUserKey  ctxKey = "user"
)

const (
	ErrorDBNotFound = "no rows in result set"
	ErrorInternal   = "internal server error"
	ErrorCache      = "failed to set/get cache"
)
