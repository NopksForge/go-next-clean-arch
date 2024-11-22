package app

type ctxKey string

const (
	refIDKey      ctxKey = "ref-id"
	forwardCtxKey ctxKey = "forwarding"
	RedisUserKey  ctxKey = "user"
)

const (
	ErrorNotFound = "no rows in result set"
)
