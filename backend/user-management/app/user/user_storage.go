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
	_, err := s.db.Exec(ctx, "insert into users(user_id, user_email, user_first_name, user_last_name, user_phone_number, user_role) values($1, $2, $3, $4, $5, $6)", data.UserId, data.UserEmail, data.UserFirstName, data.UserLastName, data.UserPhone, data.UserRole)
	return err
}

func (s *storage) GetUserById(ctx context.Context, id string) (*UserData, error) {
	var data UserData
	if err := s.db.QueryRow(ctx, "select user_id, user_email, user_first_name, user_last_name, user_phone_number, user_role, updated_at, is_active from users where user_id = $1", id).Scan(
		&data.UserId,
		&data.UserEmail,
		&data.UserFirstName,
		&data.UserLastName,
		&data.UserPhone,
		&data.UserRole,
		&data.UpdatedAt,
		&data.IsActive,
	); err != nil {
		return nil, err
	}
	return &data, nil
}

func (s *storage) GetAllUser(ctx context.Context) ([]UserData, error) {
	var users []UserData
	rows, err := s.db.Query(ctx, "select user_id, user_email, user_first_name, user_last_name, user_phone_number, user_role, updated_at, is_active from users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user UserData
		err := rows.Scan(
			&user.UserId,
			&user.UserEmail,
			&user.UserFirstName,
			&user.UserLastName,
			&user.UserPhone,
			&user.UserRole,
			&user.UpdatedAt,
			&user.IsActive,
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

func (s *storage) UpdateUser(ctx context.Context, data UserData) error {
	_, err := s.db.Exec(ctx, "update users set user_email = $1, user_first_name = $2, user_last_name = $3, user_phone_number = $4, user_role = $5, updated_at = $6, is_active = $7 where user_id = $8", data.UserEmail, data.UserFirstName, data.UserLastName, data.UserPhone, data.UserRole, data.UpdatedAt, data.IsActive, data.UserId)
	return err
}

func (s *storage) DeleteUser(ctx context.Context, id string) error {
	_, err := s.db.Exec(ctx, "delete from users where user_id = $1", id)
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
