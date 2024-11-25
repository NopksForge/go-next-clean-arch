package database

import "time"

const (
	connMaxLifetime   = time.Hour
	connMaxIdleTime   = time.Minute * 30
	maxIdleConns      = 10
	maxOpenConns      = 10
	healthCheckPeriod = time.Minute
)