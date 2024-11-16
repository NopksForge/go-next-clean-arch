package user

// swagger:route POST /users/create users createUser
// Create a new user
// responses:
//   200: createUserResponse
//   400: errorResponse
//   500: errorResponse

// swagger:parameters createUser
type swaggerCreateUserParamsWrapper struct {
	// User creation request body
	// in:body
	// required: true
	Body CreateUserRequest
}

// swagger:response createUserResponse
type swaggerCreateUserResponse struct {
	// in:body
	Body struct {
		// Example: 0
		Code int `json:"code"`
		// Example: created user successfully
		Message string `json:"message"`
	}
}

// swagger:route GET /users/{userId} users getUser
// Get user by ID
// responses:
//   200: getUserResponse
//   400: errorResponse
//   404: errorResponse
//   500: errorResponse

// swagger:parameters getUser
type swaggerGetUserParamsWrapper struct {
	// User ID
	// in:path
	// required: true
	// example: 123e4567-e89b-12d3-a456-426614174000
	UserId string `json:"userId"`
}

// swagger:response getUserResponse
type swaggerGetUserResponse struct {
	// in:body
	Body struct {
		// Example: 0
		Code int             `json:"code"`
		Data GetUserResponse `json:"data"`
	}
}

// swagger:route GET /users/list users getAllUsers
// Get all users
// responses:
//   200: getAllUsersResponse
//   500: errorResponse

// swagger:response getAllUsersResponse
type swaggerGetAllUsersResponse struct {
	// in:body
	Body struct {
		// Example: 0
		Code int                `json:"code"`
		Data GetAllUserResponse `json:"data"`
	}
}

// swagger:route PUT /users/{userId} users updateUser
// Update user
// responses:
//   200: updateUserResponse
//   400: errorResponse
//   404: errorResponse
//   500: errorResponse

// swagger:parameters updateUser
type swaggerUpdateUserParamsWrapper struct {
	// User ID
	// in:path
	// required: true
	// example: 123e4567-e89b-12d3-a456-426614174000
	UserId string `json:"userId"`

	// User update request body
	// in:body
	// required: true
	Body UpdateUserRequest
}

// swagger:response updateUserResponse
type swaggerUpdateUserResponse struct {
	// in:body
	Body struct {
		// Example: 0
		Code int `json:"code"`
		// Example: updated user successfully
		Message string `json:"message"`
	}
}

// swagger:route DELETE /users/{userId} users deleteUser
// Delete user
// responses:
//   200: deleteUserResponse
//   400: errorResponse
//   500: errorResponse

// swagger:parameters deleteUser
type swaggerDeleteUserParamsWrapper struct {
	// User ID
	// in:path
	// required: true
	// example: 123e4567-e89b-12d3-a456-426614174000
	UserId string `json:"userId"`
}

// swagger:response deleteUserResponse
type swaggerDeleteUserResponse struct {
	// in:body
	Body struct {
		// Example: 0
		Code int `json:"code"`
		// Example: deleted user successfully
		Message string `json:"message"`
	}
}

// swagger:response errorResponse
type swaggerErrorResponse struct {
	// in:body
	Body struct {
		// Example: 1
		Code int `json:"code"`
		// Example: error message
		Message string `json:"message"`
	}
}
