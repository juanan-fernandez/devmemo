# delete-account-spec

# Current Feature

<!-- Feature Name -->

## Status

In Progress

## Goals

- Implement the delete account flow on the `/profile` page.
- Redesign the existing `Eliminar cuenta` button with destructive styling that clearly communicates irreversible danger.
- Open a confirmation modal when the delete button is clicked.
- Show a Spanish warning message explaining that all account data will be permanently and irreversibly lost.
- Add a text input that requires the exact word `BORRAR` before confirmation.
- Keep the `Continuar` button fully disabled until the user types `BORRAR` exactly.
- Create a server action to delete the authenticated user account.
- Delete the user record from the database and rely on proper cascading removal of associated data.
- Terminate the user session immediately after successful deletion.
- Redirect the user to the landing page or login page with a success message after deletion.
- If the authenticated user email is `demo@devmemo.com`, do not allow deletion and show the Spanish message: `El usuario demo no se puede eliminar`.
- Ensure all UI text for this feature is in Spanish.

## Notes

- Source spec: `context/features/delete-account-spec.md`.
- The first H1 sets the branch seed to `delete-account-spec`.
- The flow affects the protected `/profile` experience.
- The server action should operate only on the authenticated user; account identity must not come from client input.
- The demo user `demo@devmemo.com` must never be deleted from the database.
- Likely relevant areas include the profile UI, auth/session handling, and database deletion behavior.

## History

<!-- refers to the file @context/history.md -->
