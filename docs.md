**Auth - Register**

- **Endpoint:** POST /api/auth/register
- **Description:** Register a new user (student or teacher). Validation is performed by `UserRegisterBodySchema`.
- **Files:** [src/auth/auth.routes.ts](src/auth/auth.routes.ts), [src/auth/auth.controllers.ts](src/auth/auth.controllers.ts), [src/auth/auth.services.ts](src/auth/auth.services.ts), [src/auth/auth.dto.ts](src/auth/auth.dto.ts)

**Request**
- **Content-Type:** application/json
- **Body schema:**
	- **first_name**: string (required) — 2–35 chars
	- **last_name**: string (required) — 2–35 chars
	- **email**: string (required) — must be a valid email
	- **password**: string (required) — min 8, includes uppercase, lowercase, number, special char
	- **bio**: string (optional) — max 500
	- **student_id**: string (optional) — numeric string of length 12; required when `role` is `STUDENT`
	- **role**: enum `STUDENT` | `TEACHER` (default: `STUDENT`)

Notes:
- For `role: TEACHER` a `student_id` is not allowed.

**Responses**
- **200 OK**: Registration successful
	- Body: `{ message: "user register success", user: <User without password> }`
- **400 Bad Request**: Validation error (request body fails zod schema)
- **400 Bad Request**: Duplicate field error — when `email` or `student_id` already exists. Error messages:
	- `The email is taken` when `email` is duplicate
	- `Student with this id already exist` when `student_id` is duplicate
- **500 Internal Server Error**: Unexpected server error

**Examples**

Request (student):

```json
{
	"first_name": "Jane",
	"last_name": "Doe",
	"email": "jane.doe@example.com",
	"password": "StrongP@ssw0rd",
	"student_id": "123456789012",
	"role": "STUDENT",
	"bio": "Computer Science student"
}
```

Request (teacher):

```json
{
	"first_name": "John",
	"last_name": "Smith",
	"email": "john.smith@example.com",
	"password": "AnotherP@ss1",
	"role": "TEACHER",
	"bio": "Math teacher"
}
```

Curl example:

```bash
curl -X POST "http://localhost:3000/api/auth/register" \
	-H "Content-Type: application/json" \
	-d '{"first_name":"Jane","last_name":"Doe","email":"jane.doe@example.com","password":"StrongP@ssw0rd","student_id":"123456789012"}'
```

Axios example:

```ts
import axios from "axios";

const response = await axios.post("http://localhost:3000/api/auth/register", {
	first_name: "Jane",
	last_name: "Doe",
	email: "jane.doe@example.com",
	password: "StrongP@ssw0rd",
	student_id: "123456789012",
	role: "STUDENT"
});

console.log(response.data);
```

**Implementation notes**
- Request validation is handled by `UserRegisterBodySchema` in [src/auth/auth.dto.ts](src/auth/auth.dto.ts).
- The controller returns `{ message: "user register success", user }` on success ([src/auth/auth.controllers.ts](src/auth/auth.controllers.ts)).
- The service uses the database to create the user and maps Prisma unique-constraint errors (P2002) to clear 400 messages for duplicate `email`/`student_id` ([src/auth/auth.services.ts](src/auth/auth.services.ts)).

---

**Auth - Login**

- **Endpoint:** POST /api/auth/login
- **Description:** Authenticate a user and return access + refresh tokens. Validation is performed by `UserLoginBodySchema`.
- **Files:** [src/auth/auth.routes.ts](src/auth/auth.routes.ts), [src/auth/auth.controllers.ts](src/auth/auth.controllers.ts), [src/auth/auth.services.ts](src/auth/auth.services.ts), [src/auth/auth.dto.ts](src/auth/auth.dto.ts)

**Request**
- **Content-Type:** application/json
- **Body schema:**
	- **password**: string (required) — min 8, includes uppercase, lowercase, number, special char
	- **student_id**: string (optional) — numeric string of length 12
	- **email**: string (optional) — valid email

Notes:
- Provide **either** `student_id` **or** `email`, not both.
- At least one of `student_id` or `email` is required.
- Students can only log in with `student_id` (login by `email` for students is rejected).

**Headers**
- Optional: `x-device` to label the login device/session.
- If not provided, the API builds a device label from user-agent information.

**Responses**
- **200 OK**: Authentication successful
	- Body: `{ accessToken: string, refreshToken: string }`
- **400 Bad Request**:
	- Validation error (request body fails zod schema)
	- `Can not login with email` when a student tries email login
- **401 Unauthorized**:
	- `Invalid email or password` for wrong credentials or unknown user
- **500 Internal Server Error**: Unexpected server error

**Examples**

Request (student login):

```json
{
	"student_id": "123456789012",
	"password": "StrongP@ssw0rd"
}
```

Request (teacher login):

```json
{
	"email": "john.smith@example.com",
	"password": "AnotherP@ss1"
}
```

Curl example:

```bash
curl -X POST "http://localhost:3000/api/auth/login" \
	-H "Content-Type: application/json" \
	-H "x-device: MacBook Pro Chrome" \
	-d '{"student_id":"123456789012","password":"StrongP@ssw0rd"}'
```

Axios example:

```ts
import axios from "axios";

const response = await axios.post(
	"http://localhost:3000/api/auth/login",
	{
		student_id: "123456789012",
		password: "StrongP@ssw0rd"
	},
	{
		headers: {
			"x-device": "MacBook Pro Chrome"
		}
	}
);

console.log(response.data.accessToken, response.data.refreshToken);
```

**Implementation notes**
- Request validation is handled by `UserLoginBodySchema` in [src/auth/auth.dto.ts](src/auth/auth.dto.ts).
- The controller returns `{ accessToken, refreshToken }` on success ([src/auth/auth.controllers.ts](src/auth/auth.controllers.ts)).
- The service verifies credentials, enforces role-based login rule for students, and creates a hashed session token entry in DB ([src/auth/auth.services.ts](src/auth/auth.services.ts)).

---

**Auth - Refresh Access Token**

- **Endpoint:** POST /api/auth/refresh-token
- **Description:** Exchange a valid refresh token for a new access token. Validation is performed by `RefreshTokenBodySchema`.
- **Files:** [src/auth/auth.routes.ts](src/auth/auth.routes.ts), [src/auth/auth.controllers.ts](src/auth/auth.controllers.ts), [src/auth/auth.services.ts](src/auth/auth.services.ts), [src/auth/auth.dto.ts](src/auth/auth.dto.ts)

**Request**
- **Content-Type:** application/json
- **Body schema:**
	- **refresh_token**: string (required) — must be a valid JWT format

**Responses**
- **200 OK**: Refresh successful
	- Body: `{ accessToken: string }`
- **400 Bad Request**: Validation error (missing/invalid JWT shape)
- **401 Unauthorized**:
	- `user is not authentificated` when refresh token verification fails
	- `invalid or expired session login again` when session is missing/expired/invalid
- **500 Internal Server Error**: Unexpected server error

**Examples**

Request:

```json
{
	"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ.signature"
}
```

Curl example:

```bash
curl -X POST "http://localhost:3000/api/auth/refresh-token" \
	-H "Content-Type: application/json" \
	-d '{"refresh_token":"<your_refresh_token>"}'
```

Axios example:

```ts
import axios from "axios";

const response = await axios.post("http://localhost:3000/api/auth/refresh-token", {
	refresh_token: "<your_refresh_token>"
});

console.log(response.data.accessToken);
```

**Implementation notes**
- Request validation is handled by `RefreshTokenBodySchema` in [src/auth/auth.dto.ts](src/auth/auth.dto.ts).
- The controller returns `{ accessToken }` on success ([src/auth/auth.controllers.ts](src/auth/auth.controllers.ts)).
- The service verifies JWT payload, validates hashed session state in DB, then issues a new access token ([src/auth/auth.services.ts](src/auth/auth.services.ts)).

---

**Auth - Send Reset OTP**

- **Endpoint:** POST /api/auth/reset
- **Description:** Sends a 6-digit OTP to the user email for password reset flow.
- **Files:** [src/auth/auth.routes.ts](src/auth/auth.routes.ts), [src/auth/auth.controllers.ts](src/auth/auth.controllers.ts), [src/auth/auth.services.ts](src/auth/auth.services.ts), [src/auth/auth.dto.ts](src/auth/auth.dto.ts)

**Request**
- **Content-Type:** application/json
- **Body schema:**
	- **email**: string (required) — must be a valid email

**Responses**
- **200 OK**: OTP mail send attempted
	- Body: `{ user_id: string, result: any }`
- **400 Bad Request**:
	- Validation error (invalid/missing email)
	- `Email provided is invalid` when no user exists with that email
- **500 Internal Server Error**: Unexpected server error

**Examples**

Request:

```json
{
	"email": "john.smith@example.com"
}
```


```bash
curl -X POST "http://localhost:3000/api/auth/reset" \
	-H "Content-Type: application/json" \
	-d '{"email":"john.smith@example.com"}'
```

Axios example:

```ts
import axios from "axios";

const response = await axios.post("http://localhost:3000/api/auth/reset", {
	email: "john.smith@example.com"
});

console.log(response.data.user_id, response.data.result);
```

**Implementation notes**
- Request validation is handled by `SendResetPasswordOtpBodySchema` in [src/auth/auth.dto.ts](src/auth/auth.dto.ts).
- The service creates an OTP row and sends an email template through nodemailer ([src/auth/auth.services.ts](src/auth/auth.services.ts), [src/auth/auth.utils.ts](src/auth/auth.utils.ts)).

---

**Auth - Verify Reset OTP**

- **Endpoint:** POST /api/auth/reset/verify
- **Description:** Verifies OTP and returns a short-lived reset token used in the final password reset request.
- **Files:** [src/auth/auth.routes.ts](src/auth/auth.routes.ts), [src/auth/auth.controllers.ts](src/auth/auth.controllers.ts), [src/auth/auth.services.ts](src/auth/auth.services.ts), [src/auth/auth.dto.ts](src/auth/auth.dto.ts), [src/auth/auth.utils.ts](src/auth/auth.utils.ts)

**Request**
- **Content-Type:** application/json
- **Body schema:**
	- **user_id**: string (required) — UUID
	- **otp_code**: string (required) — 6 numeric digits

**Responses**
- **200 OK**: OTP verified
	- Body: `{ verified: true, reset_token: string }`
- **400 Bad Request**:
	- Validation error (invalid UUID / invalid OTP format)
	- `Invalid or expired otp code`
- **500 Internal Server Error**: Unexpected server error

**Examples**

Request:

```json
{
	"user_id": "0f2a3473-6a59-4f01-8c81-bf75644f1aa2",
	"otp_code": "123456"
}
```

Curl example:

```bash
curl -X POST "http://localhost:3000/api/auth/reset/verify" \
	-H "Content-Type: application/json" \
	-d '{"user_id":"0f2a3473-6a59-4f01-8c81-bf75644f1aa2","otp_code":"123456"}'
```

Axios example:

```ts
import axios from "axios";

const response = await axios.post("http://localhost:3000/api/auth/reset/verify", {
	user_id: "0f2a3473-6a59-4f01-8c81-bf75644f1aa2",
	otp_code: "123456"
});

console.log(response.data.verified, response.data.reset_token);
```

**Implementation notes**
- Request validation is handled by `VerifyOtpBodySchema` in [src/auth/auth.dto.ts](src/auth/auth.dto.ts).
- OTP is validated with a 10-minute window, then consumed (deleted), and a reset token is issued ([src/auth/auth.services.ts](src/auth/auth.services.ts)).
- Reset token expiry is `2m` from issuance ([src/auth/auth.utils.ts](src/auth/auth.utils.ts)).

---

**Auth - Reset Password**

- **Endpoint:** PATCH /api/auth/reset
- **Description:** Resets user password using the reset token from OTP verification.
- **Files:** [src/auth/auth.routes.ts](src/auth/auth.routes.ts), [src/auth/auth.services.ts](src/auth/auth.services.ts), [src/auth/auth.dto.ts](src/auth/auth.dto.ts), [src/auth/auth.utils.ts](src/auth/auth.utils.ts)

**Request**
- **Content-Type:** application/json
- **Body schema:**
	- **reset_token**: string (required) — JWT format
	- **new_password**: string (required) — min 8, includes uppercase, lowercase, number, special char

**Responses**
- **200 OK**: Password reset successful
	- Body: `{ password_changed: true }`
- **400 Bad Request**: Validation error (invalid token format/password rules)
- **403 Forbidden**:
	- `Can not reset password try again` when reset token verification fails/expired
	- `Can not reset password invalid data` when token payload user is invalid
- **500 Internal Server Error**: Unexpected server error

**Examples**

Request:

```json
{
	"reset_token": "<reset_token_from_verify_endpoint>",
	"new_password": "N3wStrongP@ss!"
}
```

Curl example:

```bash
curl -X PATCH "http://localhost:3000/api/auth/reset" \
	-H "Content-Type: application/json" \
	-d '{"reset_token":"<reset_token_from_verify_endpoint>","new_password":"N3wStrongP@ss!"}'
```

Axios example:

```ts
import axios from "axios";

const response = await axios.patch("http://localhost:3000/api/auth/reset", {
	reset_token: "<reset_token_from_verify_endpoint>",
	new_password: "N3wStrongP@ss!"
});

console.log(response.data.password_changed);
```

**Implementation notes**
- Request validation is handled by `ResetPasswordBodySchema` in [src/auth/auth.dto.ts](src/auth/auth.dto.ts).
- Service verifies reset token payload, resolves user, hashes the new password, then updates user credentials ([src/auth/auth.services.ts](src/auth/auth.services.ts)).

---

**Auth - Logout**

- **Endpoint:** POST /api/auth/logout
- **Description:** Logs out the authenticated user by invalidating the active refresh-token session.
- **Files:** [src/auth/auth.routes.ts](src/auth/auth.routes.ts), [src/auth/auth.controllers.ts](src/auth/auth.controllers.ts), [src/auth/auth.services.ts](src/auth/auth.services.ts), [src/auth/auth.dto.ts](src/auth/auth.dto.ts), [src/midlewares/auth/is-authenticated.midleware.ts](src/midlewares/auth/is-authenticated.midleware.ts)

**Request**
- **Content-Type:** application/json
- **Headers:**
	- **Authorization**: `Bearer <access_token>` (required)
- **Body schema (intended):**
	- **refresh_token**: string (required) — valid JWT format

**Responses**
- **200 OK**: Logout successful
	- Body: `{ deleteStatus: true }`
- **400 Bad Request**: Validation error (missing/invalid body shape)
- **401 Unauthorized**: Missing/invalid access token in `Authorization` header
- **404 Not Found**:
	- `invalid session data` when session is missing or already expired
- **500 Internal Server Error**: Unexpected server error

**Examples**

Request:

```json
{
	"refresh_token": "<your_refresh_token>"
}
```

Curl example:

```bash
curl -X POST "http://localhost:3000/api/auth/logout" \
	-H "Authorization: Bearer <your_access_token>" \
	-H "Content-Type: application/json" \
	-d '{"refresh_token":"<your_refresh_token>"}'
```

Axios example:

```ts
import axios from "axios";

const response = await axios.post(
	"http://localhost:3000/api/auth/logout",
	{ refresh_token: "<your_refresh_token>" },
	{
		headers: {
			Authorization: "Bearer <your_access_token>"
		}
	}
);

console.log(response.data.deleteStatus);
```

**Implementation notes**
- Route is protected by `isAuthenticated` middleware ([src/midlewares/auth/is-authenticated.midleware.ts](src/midlewares/auth/is-authenticated.midleware.ts)).
- Controller forwards `refresh_token` to `userLogoutService`, which finds and deletes the hashed session token ([src/auth/auth.controllers.ts](src/auth/auth.controllers.ts), [src/auth/auth.services.ts](src/auth/auth.services.ts)).
- `LogoutBodySchema` exists in [src/auth/auth.dto.ts](src/auth/auth.dto.ts) and is the matching DTO for this endpoint.


---

**University - Get All Universities**

- **Endpoint:** GET /api/university
- **Description:** Retrieves a paginated list of all universities with optional filtering and sorting.
- **Files:** [src/university/university.routes.ts](src/university/university.routes.ts), [src/university/university.controllers.ts](src/university/university.controllers.ts), [src/university/university.services.ts](src/university/university.services.ts)

**Request**
- **Query Parameters (optional):**
	- **page**: number (default: 1) — pagination page number
	- **limit**: number (default: 10) — items per page
	- **search**: string (optional) — search by university name
	- **sortBy**: string (optional) — field to sort by (e.g., `name`, `createdAt`)
	- **order**: `asc` | `desc` (default: `asc`) — sort direction

**Responses**
- **200 OK**: Universities retrieved successfully
	- Body: `{ data: University[], total: number, page: number, limit: number }`
- **400 Bad Request**: Invalid query parameters
- **500 Internal Server Error**: Unexpected server error

**Examples**

Curl example:

```bash
curl -X GET "http://localhost:3000/api/university?page=1&limit=10&search=MIT"
```

Axios example:

```ts
import axios from "axios";

const response = await axios.get("http://localhost:3000/api/university", {
	params: { page: 1, limit: 10, search: "MIT" }
});

console.log(response.data);
```

---


**Department - Get All Departments**

- **Endpoint:** GET /api/departments
- **Description:** Retrieves a paginated list of all departments with optional filtering.
- **Files:** [src/departments/department.routes.ts](src/departments/department.routes.ts), [src/departments/department.controllers.ts](src/departments/department.controllers.ts), [src/departments/department.services.ts](src/departments/department.services.ts)

**Request**
- **Query Parameters (optional):**
	- **page**: number (default: 1)
	- **limit**: number (default: 10)
	- **universityId**: string (optional) — filter by university ID
	- **search**: string (optional) — search by department name

**Responses**
- **200 OK**: Departments retrieved successfully
	- Body: `{ data: Department[], total: number, page: number, limit: number }`
- **400 Bad Request**: Invalid query parameters
- **500 Internal Server Error**: Unexpected server error

**Examples**

Curl example:

```bash
curl -X GET "http://localhost:3000/api/departments?universityId=550e8400-e29b-41d4-a716-446655440000"
```

Axios example:

```ts
import axios from "axios";

const response = await axios.get("http://localhost:3000/api/departments", {
	params: { universityId: "550e8400-e29b-41d4-a716-446655440000" }
});

console.log(response.data);
```

---

**Field - Get All Fields**

- **Endpoint:** GET /api/fields
- **Description:** Retrieves a paginated list of all fields with optional filtering.
- **Files:** [src/fields/field.routes.ts](src/fields/field.routes.ts), [src/fields/field.controllers.ts](src/fields/field.controllers.ts), [src/fields/field.service.ts](src/fields/field.service.ts)

**Request**
- **Query Parameters (optional):**
	- **page**: number (default: 1)
	- **limit**: number (default: 10)
	- **departmentId**: string (optional) — filter by department ID
	- **search**: string (optional) — search by field name

**Responses**
- **200 OK**: Fields retrieved successfully
	- Body: `{ data: Field[], total: number, page: number, limit: number }`
- **400 Bad Request**: Invalid query parameters
- **500 Internal Server Error**: Unexpected server error

---

**User - Upload User Avatar (Initial)**

- **Endpoint:** POST /api/user/avatar
- **Description:** Upload a profile picture for a user (initial setup, no authentication required).
- **Files:** [src/user/user.routes.ts](src/user/user.routes.ts), [src/user/user.controller.ts](src/user/user.controller.ts), [src/user/user.service.ts](src/user/user.service.ts)

**Request**
- **Content-Type:** multipart/form-data
- **Body:**
	- **user_id**: string (required) — UUID of the user
	- **picture**: file (required) — image file for profile picture

**Responses**
- **200 OK**: Profile picture uploaded successfully
	- Body: `{ message: "Profile picture uploaded successfully" }`
- **400 Bad Request**:
	- `Profile picture is required` when file is missing
- **404 Not Found**:
	- `User not found` when user_id is invalid or doesn't exist
- **500 Internal Server Error**: Unexpected server error (e.g., Cloudinary upload failure)

**Examples**

Curl example:

```bash
curl -X POST "http://localhost:3000/api/user/avatar" \
	-H "Authorization: Bearer <your_access_token>" \
	-F "user_id=0f2a3473-6a59-4f01-8c81-bf75644f1aa2" \
	-F "picture=@/path/to/profile.jpg"
```

Axios example:

```ts
import axios from "axios";

const formData = new FormData();
formData.append("user_id", "0f2a3473-6a59-4f01-8c81-bf75644f1aa2");
formData.append("picture", imageFile); // File object from input

const response = await axios.post(
	"http://localhost:3000/api/user/avatar",
	formData,
	{
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: "Bearer <your_access_token>"
		}
	}
);

console.log(response.data.message);
```

**Implementation notes**
- Multipart form parsing is handled by middleware (multer or similar).