# Feature: Delete Account Functionality

Implement the "Delete Account" flow on the `/profile` page. The feature requires a strict confirmation step to prevent accidental deletions. **Note: All UI text must be in Spanish.**

### 1. UI/UX Updates (Profile Page)
- **Destructive Styling:** Redesign the existing "Eliminar cuenta" (Delete Account) button. Use destructive styling (e.g., red colors, warning icons) to clearly indicate that this is a dangerous and irreversible action.

### 2. Confirmation Modal 
When the "Eliminar cuenta" button is clicked, open a confirmation modal with the following elements:
- **Warning Message:** Clearly state that all account data will be permanently lost ("Se perderá toda la información de la cuenta de forma permanente e irreversible").
- **Security Input:** Add a text input field asking the user to type the word `"BORRAR"`.
- **Submit Button:** Add a "Continuar" (Continue) button. This button **must remain completely disabled** until the exact word `"BORRAR"` is typed into the input field.

### 3. Backend Logic (Server Action)
- Create a Server Action (e.g., `deleteUserAccount`).
- Once the modal is successfully submitted, trigger this Server Action.
- **Database:** Delete the user from the Supabase `user` table (ensure cascading deletes are handled so all associated data is removed).
- **Session:** Terminate the user's session (log out) immediately after successful deletion.
- **Redirect:** Redirect the user to the landing page or login page with a success message.