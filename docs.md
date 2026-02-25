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
- For `role: STUDENT` the `student_id` must be provided.
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