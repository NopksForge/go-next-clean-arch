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

func (s *storage) CreateUser(ctx context.Context, data UserDataPG) error {
	_, err := s.db.Exec(ctx, "insert into users(user_id, user_email, user_name, created_by) values($1, $2, $3, $4)", data.UserId, data.UserEmail, data.UserName, data.CreatedBy)
	return err
}

func (s *storage) GetUserById(ctx context.Context, id string) (UserDataPG, error) {
	var data UserDataPG
	err := s.db.QueryRow(ctx, "select * from users where user_id = $1", id).Scan(&data)
	return data, err
}

func (s *storage) GetAllUser(ctx context.Context) ([]UserDataPG, error) {
	var users []UserDataPG
	rows, err := s.db.Query(ctx, "select user_id, user_email, user_name, created_by, created_at, updated_by, updated_at from users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user UserDataPG
		err := rows.Scan(
			&user.UserId,
			&user.UserEmail,
			&user.UserName,
			&user.CreatedBy,
			&user.CreatedAt,
			&user.UpdatedBy,
			&user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (s *storage) UpdateUser(ctx context.Context, data UserDataPG) error {
	_, err := s.db.Exec(ctx, "update users set user_email = $1, user_name = $2, updated_by = $3, updated_at = $4 where user_id = $5", data.UserEmail, data.UserName, data.UpdatedBy, data.UpdatedAt, data.UserId)
	return err
}

func (s *storage) DeleteUser(ctx context.Context, id string) error {
	_, err := s.db.Exec(ctx, "delete from users where user_id = $1", id)
	return err
}

type UserDataPG struct {
	UserId    uuid.UUID
	UserEmail string
	UserName  string
	CreatedBy string
	CreatedAt time.Time
	UpdatedBy *string
	UpdatedAt *time.Time
}
