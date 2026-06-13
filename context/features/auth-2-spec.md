# Instructions for Adding Credentials Provider and Registration API (NextAuth v5 + Supabase + Bcrypt)

Please implement the Credentials authentication provider and a public registration API route. Adhere strictly to the existing split authentication pattern (`auth.config.ts` and `auth.ts`) to preserve Edge runtime compatibility for the middleware.

---

### 1. Update Authentication Configuration (Split Pattern)

#### A. Modify `auth.config.ts` (Edge Compatible)
- Keep this file lightweight. Do NOT import `bcrypt` or database adapters here.
- Ensure it contains basic route definitions, OAuth providers (like GitHub), and the `authorized` callback for middleware route protection.

#### B. Modify `auth.ts` (Node.js Runtime Only)
- Import `authConfig` from `auth.config.ts`.
- Import your Supabase database client/adapter (e.g., Prisma or direct Postgres client mapped to your existing Supabase tables: `user`, `session`, `account`, `verification_token`).
- Import `bcrypt`.
- Add `CredentialsProvider` to the `providers` array:
  - Define fields for `email` and `password`.
  - Implement the `authorize` function:
    1. Validate that both email and password are provided.
    2. Query the Supabase database to find the user by `email`.
    3. If no user is found or the user does not have a hashed password stored, return `null`.
    4. Use `bcrypt.compare()` to check if the provided password matches the hashed password in the database.
    5. If valid, return the user object (id, name, email) matching the NextAuth User schema.

---

### 2. Create the Registration API Route

Create a new route file at `app/api/auth/register/route.ts` to handle user registration via POST.

#### Requirements for the POST Handler:
1. **Input Parsing:** Extract `name`, `email`, `password`, and `passwordConfirm` from the JSON request body.
2. **Validation:**
   - Verify that all fields are present and not empty.
   - Enforce a secure password policy (e.g., minimum 8 characters, containing at least one number or special character).
   - Verify that `password` and `passwordConfirm` match exactly. If they do not, return a `400 Bad Request` with an appropriate JSON error message.
3. **User Existence Check:** Query your Supabase database to ensure the `email` is not already registered. If it exists, return a `400 Bad Request` or `409 Conflict` explaining that the email is taken.
4. **Password Hashing:** Hash the password securely using `bcrypt.hash()` with a salt round factor of `10`.
5. **Database Insertion:** Insert the new user into your Supabase `user` table, mapping fields correctly (e.g., `name`, `email`, and the hashed password into the respective column).
6. **Response:** Return a `201 Created` status code with a JSON response confirming successful registration (do NOT return the hashed password in the response).

---

### 3. API Verification Task

Once implemented, verify the endpoint by executing the following `curl` command in the terminal using mock user data. Ensure it successfully returns the expected JSON structure and creates the record in your Supabase instance:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Homer Simpson",
    "email": "homer.simpson@springfield.com",
    "password": "SecurePassword123!",
    "passwordConfirm": "SecurePassword123!"
  }'
  
  ## Notes
### Credentials Provider in Split Pattern
- `auth.config.ts`: Add Credentials provider with `authorize: () => null` placeholder
- `auth.ts`: Override the Credentials provider with actual bcrypt validation logic

## References
- Credentials provider: https://authjs.dev/getting-started/authentication/credentials