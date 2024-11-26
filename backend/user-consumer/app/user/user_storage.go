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
	_, err := s.db.Exec(ctx, "insert into users(user_id, user_email, user_first_name, user_last_name, user_phone, user_role, is_active) values($1, $2, $3, $4, $5, $6, $7)", data.UserId, data.UserEmail, data.UserFirstName, data.UserLastName, data.UserPhone, data.UserRole, data.IsActive)
	return err
}

type UserData struct {
	UserId        uuid.UUID
	UserEmail     string
	UserFirstName string
	UserLastName  string
	UserPhone     string
	UserRole      string
	UpdatedAt     *time.Time
	IsActive      bool
}
