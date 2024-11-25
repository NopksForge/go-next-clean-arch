package user

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type storage struct {
	db *pgxpool.Pool
}

func NewStorage(db *pgxpool.Pool) *storage {
	return &storage{db: db}
}

func (s *storage) CreateUser(ctx context.Context, data UserData) error {
	_, err := s.db.Exec(ctx, "insert into users(user_id, user_email, user_name, created_by) values($1, $2, $3, $4)", data.UserId, data.UserEmail, data.UserName, data.CreatedBy)
	return err
}

type UserData struct {
	UserId    uuid.UUID
	UserEmail string
	UserName  string
	CreatedBy string
	CreatedAt time.Time
	UpdatedBy *string
	UpdatedAt *time.Time
}
