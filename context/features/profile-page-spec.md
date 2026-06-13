# Code Agent Instructions: User Profile and Change Password

## Goal

Implement a new user profile page at:

```text
/profile
```

The page must show basic user profile data, usage statistics, and allow changing the password when the user signed in with email/password.

Do not implement account deletion yet.

## Requirements

### 1. Profile Page

Create a new `/profile` page.

The page must be protected. Only authenticated users can access it.

Use the existing Auth.js / NextAuth v5 session/auth utilities already present in the project.

### 2. Avatar Component

Create a reusable `Avatar` component.

The component must only render the user avatar visual.

Behavior:

- If the user has an image, show the user image.
- For GitHub users, this should display the GitHub profile image stored in the user/session.
- If the user signed in with email/password and has no image, show initials.
- If the user name is `JUAN ANTONIO`, show `JA`.
- If the user has a single name, show only one initial.
- If there is no name, fall back to the first letter of the email.
- Keep the component accessible with a useful `alt` label when rendering an image.

### 3. User Info Card

In the first section of `/profile`, show a card with:

- Avatar
- Name
- Email
- Registration date

Next to this card, add two buttons:

1. Change password
2. Delete account

Important:

- The Change password button must only be visible if the user logged in with email/password.
- Do not implement the Delete account functionality yet.
- The Delete account button can be disabled or show a placeholder state, but it must not delete anything.

To determine whether the user used email/password, inspect the existing Auth.js/Prisma data model and account/provider logic. Prefer a robust server-side check, for example checking whether the user has a credentials/local password and no OAuth-only account requirement.

### 4. Change Password

Implement the change password functionality.

Requirements:

- Only available for email/password users.
- Reuse existing password validation rules.
- Reuse the existing password hashing utility.
- If an existing `reset-password-form.tsx` component or validation logic can be safely reused, reuse it.
- Do not duplicate password validation logic unnecessarily.
- The form should include:
  - current password
  - new password
  - confirm new password
- Password inputs should be hidden by default.
- Password inputs should include an eye icon to show/hide the password.
- The new password rule must be visible to the user:
  - at least 8 characters
  - includes numbers and/or symbols
- Validate current password before updating.
- After success, show a Spanish success message.

Suggested Spanish messages:

```text
Cambiar contraseña
Contraseña actual
Nueva contraseña
Confirmar nueva contraseña
La contraseña debe tener al menos 8 caracteres e incluir números y/o símbolos.
Las contraseñas no coinciden.
La contraseña actual no es correcta.
Tu contraseña se ha actualizado correctamente.
```

Use Server Actions if the project already uses them for auth forms.

### 5. Usage Statistics Card

Below the user info section, show another card with brief usage statistics:

- Total saved items.
- Total collections.
- Breakdown of items by item type in the next line.

For the breakdown:

- Use the correct icon for each item type.
- Use the correct color for each item type.
- To verify the available item types, icons, and colors, inspect:

```text
@lib/mockdata.ts
```

Do not hardcode item types blindly. Reuse existing constants/helpers if present.

### 6. Data Access

Use existing Prisma models and data access utilities.

Fetch only the authenticated user's data.

Do not expose other users' data.

If the real saved items or collections tables are not fully implemented yet, use the closest existing data source and leave a small TODO comment explaining what must be replaced later.

### 7. Security

- Protect `/profile`.
- Do not allow OAuth-only users to change password unless they have a local password.
- Verify the current password before changing it.
- Never store plain text passwords.
- Do not log passwords.
- Keep password update logic server-side.
- Do not implement delete-account behavior yet.

### 8. Acceptance Criteria

- `/profile` exists and is protected.
- The profile card shows avatar, name, email, and registration date.
- The `Avatar` component shows GitHub image when available.
- The `Avatar` component shows initials when no image exists.
- Change password is visible only for email/password users.
- Delete account button is present but does not delete anything.
- Password change validates current password.
- Password change validates password strength and confirmation.
- Password inputs support eye icon visibility toggle.
- Usage statistics card shows total items, total collections, and item count by type.
- Item type icons and colors match `@lib/mockdata.ts`.
- Code passes lint, typecheck, and build.
