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

**Implementation notes**
- Request validation is handled by `UserRegisterBodySchema` in [src/auth/auth.dto.ts](src/auth/auth.dto.ts).
- The controller returns `{ message: "user register success", user }` on success ([src/auth/auth.controllers.ts](src/auth/auth.controllers.ts)).
- The service uses the database to create the user and maps Prisma unique-constraint errors (P2002) to clear 400 messages for duplicate `email`/`student_id` ([src/auth/auth.services.ts](src/auth/auth.services.ts)).
